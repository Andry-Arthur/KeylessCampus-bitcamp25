#include <stdio.h>
#include "esp_err.h"
#include "esp_event_base.h"
#include "esp_netif.h"
#include "esp_netif_types.h"
#include "esp_wifi_default.h"
#include "esp_wifi_types_generic.h"
#include "freertos/FreeRTOS.h"

#include <string.h>
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "hal/gpio_types.h"
#include "nvs.h"
#include "nvs_flash.h"

#include "esp_log.h"
#include "driver/gpio.h"
#include "portmacro.h"

#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include "lwip/netdb.h"
#include "lwip/dns.h"


#define WIFI_SUCCESS 1 << 0
#define WIFI_FAILURE 1 << 1
#define TCP_SUCCESS 1 << 0
#define TCP_FAILURE 1 << 1
#define MAX_FAILURES 10


static EventGroupHandle_t wifi_event_group;
static int s_retry_num = 0;
static const char *TAG = "WIFI";


static void wifi_event_handler(void* arg, esp_event_base_t event_base, int32_t event_id, void* event_data){
	if(event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START){
		ESP_LOGI(TAG, "Connecting to wireless access point...\n");
		esp_wifi_connect();
	}else if(event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED){
		if(s_retry_num < MAX_FAILURES){
			ESP_LOGI(TAG, "Attempting to recconect to Access Point\n");
			esp_wifi_connect();
			s_retry_num++;
		}else {

			xEventGroupSetBits(wifi_event_group, WIFI_FAILURE);
			//TODO set ap handler and serve webpage to get new creds
		}
	}
}

static void ip_event_handler(void* arg, esp_event_base_t event_base, int32_t event_id, void* event_data){
	if(event_base ==IP_EVENT && event_id == IP_EVENT_STA_GOT_IP){
		ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data;
		ESP_LOGI(TAG, "STA IP: " IPSTR, IP2STR(&event->ip_info.ip));
		s_retry_num =0;
		xEventGroupSetBits(wifi_event_group, WIFI_SUCCESS);
	}
}

esp_err_t connect_wifi(){
	int status = WIFI_FAILURE;

	ESP_ERROR_CHECK(esp_netif_init());
	ESP_ERROR_CHECK(esp_event_loop_create_default());

	esp_netif_create_default_wifi_sta();

	wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();

	ESP_ERROR_CHECK(esp_wifi_init(&cfg));


	wifi_event_group = xEventGroupCreate();

	esp_event_handler_instance_t wifi_handler_event_instance;
	ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, &wifi_handler_event_instance));

	esp_event_handler_instance_t got_ip_event_instance;
	ESP_ERROR_CHECK(esp_event_handler_instance_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &ip_event_handler, NULL, &got_ip_event_instance));



	ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));


	wifi_config_t wifi_config = {
		.sta = {
			.ssid = "ItWouldBeRealCoolIfThisWorks",
			.password = "beans123",
			.threshold.authmode = WIFI_AUTH_WPA2_PSK,
			.pmf_cfg = {
				.capable = true,
				.required = false
			},
		},
	};

	ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
	ESP_ERROR_CHECK(esp_wifi_start());

	ESP_LOGI(TAG, "Oh yeah, we cooking with fire\n");
	 EventBits_t bits = xEventGroupWaitBits(wifi_event_group,
            WIFI_SUCCESS | WIFI_FAILURE,
            pdFALSE,
            pdFALSE,
            portMAX_DELAY);

    /* xEventGroupWaitBits() returns the bits before the call returned, hence we can test which event actually
     * happened. */
    if (bits & WIFI_SUCCESS) {
        ESP_LOGI(TAG, "Connected to ap");
        status = WIFI_SUCCESS;
    } else if (bits & WIFI_FAILURE) {

	wifi_scan_config_t scanConf = {
		.ssid = NULL,
		.bssid = NULL,
		.channel = 0,
		.show_hidden = true,
	};

	ESP_ERROR_CHECK(esp_wifi_scan_start(&scanConf, true));
	uint16_t numNetworks;
	ESP_ERROR_CHECK(esp_wifi_scan_get_ap_num(&numNetworks));
	wifi_ap_record_t* networkValues = malloc(sizeof(wifi_ap_record_t) * numNetworks);
	ESP_ERROR_CHECK(esp_wifi_scan_get_ap_records(&numNetworks, networkValues));
	
	for(int i = 0; i< numNetworks; i++){
		char* authmode;
		switch(networkValues[i].authmode){
			case WIFI_AUTH_OPEN:
				authmode="WIFI_AUTH_OPEN";
				break;
			case WIFI_AUTH_WPA3_PSK:
				authmode="WIFI_AUTH_WPA3_PSK";
				break;
			case WIFI_AUTH_WPA3_EXT_PSK:
				authmode="WIFI_AUTH_WPA3_EXT_PSK";
				break;
			case WIFI_AUTH_WPA_PSK:
				authmode="wifi auth wpa psk";
				break;
			case WIFI_AUTH_WPA2_PSK:
				authmode="wifi auth wpa2 psk";
				break;
			case WIFI_AUTH_WAPI_PSK:
				authmode="wifi auth wapi psk";
				break;
			case WIFI_AUTH_ENTERPRISE:
				authmode="wifi auth enterprise";
				break;
			case WIFI_AUTH_WPA3_ENT_192:
				authmode="wifi auth wpa3 ent 192";
				break;
			case WIFI_AUTH_WPA_WPA2_PSK:
				authmode = "wifi auth wpa wpa2 psk";
				break;
			case WIFI_AUTH_WPA3_EXT_PSK_MIXED_MODE:
				authmode = "wifi auth wpa3 ext psk mixed mode";
				break;
			default:
				authmode = "other";
				break;
		}

		printf("%s\nsecurity:%s\n", networkValues[i].ssid, authmode);
	}

	free(networkValues);


	ESP_LOGI(TAG, "Failed to connect to ap");
        status = WIFI_FAILURE;
    } else {
        ESP_LOGE(TAG, "UNEXPECTED EVENT");
        status = WIFI_FAILURE;
    }

    /* The event will not be processed after unregister */
    ESP_ERROR_CHECK(esp_event_handler_instance_unregister(IP_EVENT, IP_EVENT_STA_GOT_IP, got_ip_event_instance));
    ESP_ERROR_CHECK(esp_event_handler_instance_unregister(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_handler_event_instance));
    vEventGroupDelete(wifi_event_group);

    return status;

}

esp_err_t connect_tcp_server(void)
{
	struct sockaddr_in serverInfo = {0};
	char readBuffer[1024] = {0};

	serverInfo.sin_family = AF_INET;
	serverInfo.sin_addr.s_addr = 0xE9F4F59D;
//	serverInfo.sin_addr.s_addr =0x030A14AC;
	serverInfo.sin_port = htons(1234);


	int sock = socket(AF_INET, SOCK_STREAM, 0);
	if (sock < 0)
	{
		ESP_LOGE(TAG, "Failed to create a socket..?");
		return TCP_FAILURE;
	}


	if (connect(sock, (struct sockaddr *)&serverInfo, sizeof(serverInfo)) != 0)
	{
		ESP_LOGE(TAG, "Failed to connect to %s!", inet_ntoa(serverInfo.sin_addr.s_addr));
		close(sock);
		return TCP_FAILURE;
	}

	ESP_LOGI(TAG, "Connected to TCP server.");
	while (1){
	bzero(readBuffer, sizeof(readBuffer));
    int r = read(sock, readBuffer, sizeof(readBuffer)-1);
    for(int i = 0; i < r; i++) {
        putchar(readBuffer[i]);
    }

	    printf("%d\n", strcmp(readBuffer, "ON"));
    if (readBuffer[0] == 'O' && readBuffer[1] =='N')
    {
	    gpio_reset_pin(2);

	gpio_set_direction(2, GPIO_MODE_OUTPUT);


		gpio_set_level(2, 1);
		vTaskDelay(10000/portTICK_PERIOD_MS);
		gpio_set_level(2, 0);
    	ESP_LOGI(TAG, "WE DID IT!");
    }
	}

    return TCP_SUCCESS;
}



void app_main(void){
	
	esp_err_t status = WIFI_FAILURE;
		esp_err_t ret = nvs_flash_init();
	if(ret == ESP_ERR_NVS_PAGE_FULL || ret == ESP_ERR_NVS_NEW_VERSION_FOUND ){
		ESP_ERROR_CHECK(nvs_flash_erase());
		ret = nvs_flash_init();
	}

	ESP_ERROR_CHECK(ret);

	status = connect_wifi();
	if(WIFI_SUCCESS != status){
		ESP_LOGI(TAG, "This aint it chat");
		return;
	}
	while (1){
		status = connect_tcp_server();
		if(WIFI_SUCCESS != status){
			ESP_LOGI(TAG, "so close to glory");
			//	return;
		}
		vTaskDelay(2000/portTICK_PERIOD_MS);

	}


		



/**	
	char *taskName = pcTaskGetName(NULL);
	ESP_LOGI(taskName, "Starting up\n");

	gpio_reset_pin(4);

	gpio_set_direction(4, GPIO_MODE_OUTPUT);

	while(1){
		gpio_set_level(4, 1);
		vTaskDelay(10000/portTICK_PERIOD_MS);
		gpio_set_level(4, 0);
		vTaskDelay(10000/portTICK_PERIOD_MS);
	}
	**/
	


}


