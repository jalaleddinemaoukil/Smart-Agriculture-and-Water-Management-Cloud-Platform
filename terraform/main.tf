terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85.0"
    }
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

# Data source for current client
data "azurerm_client_config" "current" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
    ManagedBy   = "Terraform"
  }
}

# Event Hub Namespace
resource "azurerm_eventhub_namespace" "main" {
  name                = var.eventhub_namespace_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Basic"
  capacity            = 1

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_resource_group.main]
}

# Event Hub
resource "azurerm_eventhub" "main" {
  name                = var.eventhub_name
  namespace_name      = azurerm_eventhub_namespace.main.name
  resource_group_name = var.resource_group_name
  partition_count     = 2
  message_retention   = 1

  depends_on = [azurerm_eventhub_namespace.main]
}

# Event Hub Authorization Rule
resource "azurerm_eventhub_authorization_rule" "main" {
  name                = "swamp-job_swamp-event_policy"
  namespace_name      = azurerm_eventhub_namespace.main.name
  eventhub_name       = azurerm_eventhub.main.name
  resource_group_name = var.resource_group_name
  listen              = true
  send                = true
  manage              = false

  depends_on = [azurerm_eventhub.main]
}

# Cosmos DB Account
resource "azurerm_cosmosdb_account" "main" {
  name                = var.cosmosdb_account_name
  location            = var.location
  resource_group_name = var.resource_group_name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_resource_group.main]
}

# Cosmos DB SQL Database
resource "azurerm_cosmosdb_sql_database" "main" {
  name                = var.cosmosdb_database_name
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name

  depends_on = [azurerm_cosmosdb_account.main]
}

# Cosmos DB SQL Container
resource "azurerm_cosmosdb_sql_container" "main" {
  name                  = var.cosmosdb_container_name
  resource_group_name   = var.resource_group_name
  account_name          = azurerm_cosmosdb_account.main.name
  database_name         = azurerm_cosmosdb_sql_database.main.name
  partition_key_path    = "/sensorId"
  partition_key_version = 2

  depends_on = [azurerm_cosmosdb_sql_database.main]
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project_prefix}-logs"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_resource_group.main]
}

# Container App Environment
resource "azurerm_container_app_environment" "main" {
  name                       = var.container_app_env_name
  location                   = var.location
  resource_group_name        = var.resource_group_name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_log_analytics_workspace.main]
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = var.container_registry_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_resource_group.main]
}

# App Service Plan (Free tier)
resource "azurerm_service_plan" "main" {
  name                = "${var.webapp_name}-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = "F1" # Free tier

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_resource_group.main]
}

# Linux Web App
resource "azurerm_linux_web_app" "main" {
  name                = var.webapp_name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = false
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION"   = "18-lts"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "WEBSITE_RUN_FROM_PACKAGE"       = "0"
    "ENABLE_ORYX_BUILD"              = "true"
  }

  https_only = true

  tags = {
    Environment = "Development"
    Project     = "SWAMP"
  }

  depends_on = [azurerm_service_plan.main]
}
