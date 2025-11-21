variable "resource_group_name" {
  description = "Azure Resource Group name"
  type        = string
  default     = "swamp-rg"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "norwayeast"
}

variable "project_prefix" {
  description = "Prefix for all resources"
  type        = string
  default     = "swamp"
}

variable "eventhub_namespace_name" {
  description = "Event Hub Namespace name"
  type        = string
  default     = "swamp-hubs"
}

variable "eventhub_name" {
  description = "Event Hub name"
  type        = string
  default     = "swamp-event"
}

variable "cosmosdb_account_name" {
  description = "Cosmos DB account name - must be globally unique"
  type        = string
  default     = "swamp-cosmosdb-001"
}

variable "cosmosdb_database_name" {
  description = "Cosmos DB database name"
  type        = string
  default     = "swamp-db"
}

variable "cosmosdb_container_name" {
  description = "Cosmos DB container name"
  type        = string
  default     = "sensor-data"
}

variable "container_registry_name" {
  description = "Container Registry name - must be globally unique, alphanumeric only"
  type        = string
  default     = "swampacr001"
}

variable "container_app_env_name" {
  description = "Container Apps Environment name"
  type        = string
  default     = "swamp-iot-env"
}

variable "webapp_name" {
  description = "Web App Service name - must be globally unique"
  type        = string
  default     = "swamp"
}

variable "app_service_plan_sku" {
  description = "App Service Plan SKU (not used now, Free tier F1 is applied in main.tf)"
  type        = string
  default     = "F1"
}
