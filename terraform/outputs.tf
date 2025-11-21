output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "Name of the resource group"
}

output "eventhub_namespace_id" {
  value       = azurerm_eventhub_namespace.main.id
  description = "ID of the Event Hub Namespace"
}

output "eventhub_id" {
  value       = azurerm_eventhub.main.id
  description = "ID of the Event Hub"
}

output "cosmosdb_account_id" {
  value       = azurerm_cosmosdb_account.main.id
  description = "ID of the Cosmos DB account"
}

output "cosmosdb_sql_database_id" {
  value       = azurerm_cosmosdb_sql_database.main.id
  description = "ID of the Cosmos DB SQL database"
}

output "cosmosdb_sql_container_id" {
  value       = azurerm_cosmosdb_sql_container.main.id
  description = "ID of the Cosmos DB SQL container"
}

output "container_registry_id" {
  value       = azurerm_container_registry.main.id
  description = "ID of the Azure Container Registry"
}

output "log_analytics_workspace_id" {
  value       = azurerm_log_analytics_workspace.main.id
  description = "ID of the Log Analytics workspace"
}

output "container_app_environment_id" {
  value       = azurerm_container_app_environment.main.id
  description = "ID of the Container App Environment"
}

output "linux_web_app_id" {
  value       = azurerm_linux_web_app.main.id
  description = "ID of the Linux Web App"
}

output "service_plan_id" {
  value       = azurerm_service_plan.main.id
  description = "ID of the App Service Plan"
}

output "eventhub_connection_string" {
  value     = azurerm_eventhub_authorization_rule.main.primary_connection_string
  sensitive = true
}

output "container_registry_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "container_registry_admin_username" {
  value = azurerm_container_registry.main.admin_username
}

output "container_registry_admin_password" {
  value     = azurerm_container_registry.main.admin_password
  sensitive = true
}

output "webapp_default_hostname" {
  value = azurerm_linux_web_app.main.default_hostname
}

output "webapp_url" {
  value = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "cosmosdb_endpoint" {
  value = azurerm_cosmosdb_account.main.endpoint
}

output "cosmosdb_primary_key" {
  value     = azurerm_cosmosdb_account.main.primary_key
  sensitive = true
}