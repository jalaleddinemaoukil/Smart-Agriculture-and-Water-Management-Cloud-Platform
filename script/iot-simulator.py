import json
import os
import random
from datetime import datetime
from azure.eventhub import EventHubProducerClient, EventData

CONNECTION_STR = os.getenv("EVENTHUB_CONNECTION_STR")
EVENTHUB_NAME = os.getenv("EVENTHUB_NAME")

FIELDS = [
    {"id": "Field_A", "crop": "Tomatoes", "area_hectares": 2.5},
    {"id": "Field_B", "crop": "Wheat", "area_hectares": 5.0},
    {"id": "Greenhouse_C", "crop": "Lettuce", "area_hectares": 0.8},
    {"id": "Orchard_D", "crop": "Olives", "area_hectares": 3.2}
]

SENSORS = [
    {"id": "sensor_001", "field": "Field_A"},
    {"id": "sensor_002", "field": "Field_B"},
    {"id": "sensor_003", "field": "Greenhouse_C"},
    {"id": "sensor_004", "field": "Orchard_D"}
]

# REALISTIC THRESHOLDS FOR SMART ALERTS
THRESHOLDS = {
    "soilMoisture": {"critical": 25, "warning": 35, "optimal_min": 40, "optimal_max": 65},
    "temperature": {"critical_low": 10, "warning_low": 15, "optimal_min": 18, "optimal_max": 28, "warning_high": 32, "critical_high": 38},
    "humidity": {"critical": 25, "warning": 35, "optimal_min": 45, "optimal_max": 75},
    "ph": {"critical_low": 5.0, "warning_low": 5.5, "optimal_min": 6.0, "optimal_max": 7.0, "warning_high": 7.5, "critical_high": 8.0},
    "waterLevel": {"critical": 15, "warning": 25, "optimal_min": 40}
}

def calculate_status(value, metric):
    """Calculate alert status based on thresholds"""
    t = THRESHOLDS.get(metric, {})
    
    if metric in ["soilMoisture", "humidity", "waterLevel"]:
        if value < t.get("critical", 0):
            return "critical"
        elif value < t.get("warning", 0):
            return "warning"
        elif value >= t.get("optimal_min", 0):
            return "normal"
    
    elif metric == "temperature":
        if value < t["critical_low"] or value > t["critical_high"]:
            return "critical"
        elif value < t["warning_low"] or value > t["warning_high"]:
            return "warning"
        else:
            return "normal"
    
    elif metric == "ph":
        if value < t["critical_low"] or value > t["critical_high"]:
            return "critical"
        elif value < t["warning_low"] or value > t["warning_high"]:
            return "warning"
        else:
            return "normal"
    
    return "normal"

def generate_sensor_data():
    """Generate realistic agricultural IoT sensor data"""
    sensor = random.choice(SENSORS)
    field = next(f for f in FIELDS if f["id"] == sensor["field"])
    
    # Generate realistic sensor readings with natural variations
    temperature = round(random.uniform(15.0, 32.0), 2)
    humidity = round(random.uniform(35.0, 75.0), 2)
    soilMoisture = round(random.uniform(20.0, 70.0), 2)
    ph = round(random.uniform(5.5, 7.8), 2)
    waterLevel = round(random.uniform(10.0, 95.0), 2)  # cm or %
    lightIntensity = round(random.uniform(200.0, 1000.0), 2)  # lux
    
    # Add realistic patterns (e.g., lower moisture = higher temp correlation)
    if soilMoisture < 30:
        temperature = round(random.uniform(25.0, 35.0), 2)
    
    # Calculate overall status (worst condition wins)
    statuses = [
        calculate_status(soilMoisture, "soilMoisture"),
        calculate_status(temperature, "temperature"),
        calculate_status(humidity, "humidity"),
        calculate_status(ph, "ph"),
        calculate_status(waterLevel, "waterLevel")
    ]
    
    # Priority: critical > warning > normal
    if "critical" in statuses:
        overall_status = "critical"
    elif "warning" in statuses:
        overall_status = "warning"
    else:
        overall_status = "normal"
    
    data = {
        "sensorId": sensor["id"],
        "fieldId": field["id"],
        "cropType": field["crop"],
        "areaHectares": field["area_hectares"],
        
        # Sensor readings
        "temperature": temperature,
        "humidity": humidity,
        "soilMoisture": soilMoisture,
        "phLevel": ph,
        "waterLevel": waterLevel,
        "lightIntensity": lightIntensity,
        
        # Metadata
        "timestamp": datetime.utcnow().isoformat(),
        "status": overall_status,
        
        # Individual metric statuses for detailed alerts
        "alerts": {
            "soilMoisture": calculate_status(soilMoisture, "soilMoisture"),
            "temperature": calculate_status(temperature, "temperature"),
            "humidity": calculate_status(humidity, "humidity"),
            "ph": calculate_status(ph, "ph"),
            "waterLevel": calculate_status(waterLevel, "waterLevel")
        }
    }
    
    return data

def send_data_to_eventhub():
    """Send data to Azure Event Hub"""
    producer = EventHubProducerClient.from_connection_string(
        conn_str=CONNECTION_STR,
        eventhub_name=EVENTHUB_NAME
    )
    try:
        sensor_data = generate_sensor_data()
        event_data = EventData(json.dumps(sensor_data))
        with producer:
            producer.send_batch([event_data])
        
        
        status_emoji = {"normal": "✅", "warning": "⚠️", "critical": "🔴"}
        print(f"{status_emoji[sensor_data['status']]} [{sensor_data['timestamp']}] "
              f"{sensor_data['fieldId']} ({sensor_data['cropType']}) - "
              f"Temp: {sensor_data['temperature']}°C, "
              f"Soil: {sensor_data['soilMoisture']}%, "
              f"pH: {sensor_data['phLevel']}")
        
    except Exception as e:
        print(f"❌ Error sending data: {e}")

if __name__ == "__main__":
    import time
    print("Starting Enhanced Farming IoT Simulator...")
    print("Sending data to Azure Event Hub...\n")
    
    # For continuous simulation, run in loop
    while True:
        send_data_to_eventhub()
        time.sleep(5)  