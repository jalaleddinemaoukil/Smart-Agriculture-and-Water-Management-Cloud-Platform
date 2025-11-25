import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Sparkles, TrendingUp, Droplets, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Analytics() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics & Insights</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Coming Soon Alert */}
          <Alert className="border-chart-1 bg-chart-1/10">
            <Sparkles className="h-4 w-4 text-chart-1" />
            <AlertTitle className="text-chart-1">AI-Powered Insights Coming Soon</AlertTitle>
            <AlertDescription>
              Advanced analytics and predictive models will be available in Week 3 (Phase 3: Intelligence & ML)
            </AlertDescription>
          </Alert>

          {/* Placeholder Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Predictive Irrigation */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-chart-1" />
                  <CardTitle className="text-base">Predictive Irrigation</CardTitle>
                </div>
                <CardDescription>
                  AI-powered irrigation scheduling based on weather forecasts and soil trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Coming in Phase 3
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Detection */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-chart-2" />
                  <CardTitle className="text-base">Anomaly Detection</CardTitle>
                </div>
                <CardDescription>
                  Automatic detection of unusual sensor patterns and potential issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Coming in Phase 3
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Yield Prediction */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                  <CardTitle className="text-base">Yield Prediction</CardTitle>
                </div>
                <CardDescription>
                  Forecast crop yields based on environmental conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Coming in Phase 3
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Historical Comparison */}
            <Card className="border-dashed md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-chart-4" />
                  <CardTitle className="text-base">Historical Comparison</CardTitle>
                </div>
                <CardDescription>
                  Compare current conditions with past seasons and industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    Coming in Phase 3
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Generated Reports */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-chart-5" />
                  <CardTitle className="text-base">Auto Reports (PDF)</CardTitle>
                </div>
                <CardDescription>
                  Weekly AI-generated reports with actionable insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming in Phase 3
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Download Sample Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
              <CardDescription>Planned AI/ML features roadmap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-1 text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Week 1-2: Data Foundation</p>
                    <p className="text-sm text-muted-foreground">
                      Establish data pipeline, collect sensor readings, build dashboard (Current Phase ✓)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Week 3: ML Model Development</p>
                    <p className="text-sm text-muted-foreground">
                      Train anomaly detection models, implement predictive algorithms using Azure ML Studio
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Week 4: Integration & Testing</p>
                    <p className="text-sm text-muted-foreground">
                      Deploy ML models to Azure Functions, integrate with dashboard, validate predictions
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Week 5: Auto-Report Generation</p>
                    <p className="text-sm text-muted-foreground">
                      Implement PDF report generation with AI-powered insights and recommendations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}