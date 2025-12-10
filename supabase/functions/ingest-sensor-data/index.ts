import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {

    try {
    
    const auth = req.headers.get("authorization") || "";
    const expected = `Bearer ${Deno.env.get("SERVICE_ROLE_KEY") || ""}`;
    if (!auth || auth !== expected) {
      return new Response(JSON.stringify({ error: "missing or invalid authorization" }), { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")! 
    );

    const body = await req.json();

    const sensorIdentifier = body.sensor_id;
    if (!sensorIdentifier) {
      return new Response(JSON.stringify({ error: "sensor_id required" }), { status: 400 });
    }
    
    const { data: sensor, error: sensorErr } = await supabase
      .from("sensors")
      .select("id, farm_id, sensor_id")
      .eq("sensor_id", sensorIdentifier)
      .limit(1)
      .maybeSingle();

    if (sensorErr || !sensor) {
      return new Response(JSON.stringify({ error: "Invalid sensor_id" }), { status: 400 });
    }

    const reading = {
      sensor_id: sensor.id, 
      farm_id: sensor.farm_id,
      timestamp: body.timestamp ?? new Date().toISOString(),
      temperature: body.temperature ?? null,
      humidity: body.humidity ?? null,
      soil_moisture: body.soil_moisture ?? null,
      water_used: body.water_used ?? null,
      created_at: new Date().toISOString()
    };

    const { error: insertErr } = await supabase
      .from("sensor_readings")
      .insert([reading]);

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ status: "OK" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
