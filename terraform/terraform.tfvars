# CUSTOMIZE THESE VALUES FOR YOUR PROJECT
resource_group_name     = "swamp-rg"
location                = "norwayeast"
project_prefix          = "swamp"
eventhub_namespace_name = "swamp-hubs"
eventhub_name           = "swamp-event"

# IMPORTANT: Change these to be globally unique (add your initials or random numbers)
cosmosdb_account_name   = "swamp-cosmosdb-ac"
container_registry_name = "swamparc" # Change "jm" to your initials (no hyphens!)
webapp_name             = "swamp"

cosmosdb_database_name  = "swamp-db"
cosmosdb_container_name = "sensor-data"
container_app_env_name  = "swamp-iot-env"
app_service_plan_sku    = "B1"
