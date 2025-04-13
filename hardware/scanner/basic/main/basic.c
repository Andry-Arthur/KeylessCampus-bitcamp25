#include <esp_log.h>
#include "rc522.h"
#include "driver/rc522_spi.h"
#include "rc522_picc.h"

#include <stdio.h>
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
#define RC522_SPI_BUS_GPIO_MISO    (25)
#define RC522_SPI_BUS_GPIO_MOSI    (23)
#define RC522_SPI_BUS_GPIO_SCLK    (19)
#define RC522_SPI_SCANNER_GPIO_SDA (22)
#define RC522_SCANNER_GPIO_RST     (-1) // soft-reset

  static EventGroupHandle_t wifi_event_group;
  static int s_retry_num = 0;
static const char *TAG = "Scanner";



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
          ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, &wifi_handler_event_instance  ));
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
      if (bits & WIFI_SUCCESS) {
          ESP_LOGI(TAG, "Connected to ap");
          status = WIFI_SUCCESS;
      } else if (bits & WIFI_FAILURE) {
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

esp_err_t connect_tcp_server(rc522_picc_t *cardInfo)
  {
          struct sockaddr_in serverInfo = {0};
          //char readBuffer[1024] = {0};
          serverInfo.sin_family = AF_INET;
          serverInfo.sin_addr.s_addr = 0xE9F4F59D;
  //      serverInfo.sin_addr.s_addr =0x030A14AC;
          serverInfo.sin_port = htons(4321);
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
	  char uidStr[ RC522_PICC_UID_STR_BUFFER_SIZE_MAX]= {0};
	  esp_err_t getUid = rc522_picc_uid_to_str(&cardInfo->uid, uidStr,  RC522_PICC_UID_STR_BUFFER_SIZE_MAX);
	  write(sock, uidStr, 10);
	  
	 close(sock);

      return TCP_SUCCESS;
  }


static rc522_spi_config_t driver_config = {
    .host_id = SPI3_HOST,
    .bus_config = &(spi_bus_config_t){
        .miso_io_num = RC522_SPI_BUS_GPIO_MISO,
        .mosi_io_num = RC522_SPI_BUS_GPIO_MOSI,
        .sclk_io_num = RC522_SPI_BUS_GPIO_SCLK,
    },
    .dev_config = {
        .spics_io_num = RC522_SPI_SCANNER_GPIO_SDA,
    },
    .rst_io_num = RC522_SCANNER_GPIO_RST,
};

static rc522_driver_handle_t driver;
static rc522_handle_t scanner;

static void on_picc_state_changed(void *arg, esp_event_base_t base, int32_t event_id, void *data)
{
    rc522_picc_state_changed_event_t *event = (rc522_picc_state_changed_event_t *)data;
    rc522_picc_t *picc = event->picc;

    if (picc->state == RC522_PICC_STATE_ACTIVE) {
        rc522_picc_print(picc);
	connect_tcp_server(picc);
    }
    else if (picc->state == RC522_PICC_STATE_IDLE && event->old_state >= RC522_PICC_STATE_ACTIVE) {
        ESP_LOGI(TAG, "Card has been removed");
    }
}

void app_main()
{
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

	rc522_spi_create(&driver_config, &driver);
	rc522_driver_install(driver);

	rc522_config_t scanner_config = {
		.driver = driver,
	};

	rc522_create(&scanner_config, &scanner);
	rc522_register_events(scanner, RC522_EVENT_PICC_STATE_CHANGED, on_picc_state_changed, NULL);
	rc522_start(scanner);
}

