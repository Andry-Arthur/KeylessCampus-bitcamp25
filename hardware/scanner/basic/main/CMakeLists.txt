idf_component_register(SRCS "basic.c"
	PRIV_REQUIRES spi_flash
                    PRIV_REQUIRES esp_wifi
                    PRIV_REQUIRES nvs_flash
                    PRIV_REQUIRES esp_driver_gpio
                    INCLUDE_DIRS ".")
