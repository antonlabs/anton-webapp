import {AfterViewInit, Component, Inject, Input, NgZone, OnInit, PLATFORM_ID} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";

import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {

  @Input() values: number[] = [];

  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, ({
          radius: am5.percent(90),
          innerRadius: am5.percent(50)
        } as any))
      );

// Create series
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: "Series",
          valueField: "sales",
          categoryField: "country"
        })
      );

      series.data.setAll([{
        country: "France",
        sales: 100000
      }, {
        country: "Spain",
        sales: 160000
      }, {
        country: "United Kingdom",
        sales: 80000
      }]);

      series.slices.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2
      })

      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);

      var series2 = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: "Series",
          valueField: "sales",
          categoryField: "country"
        })
      );

      series2.data.setAll([{
        country: "France",
        sales: 60000
      }, {
        country: "Spain",
        sales: 60000
      }, {
        country: "United Kingdom",
        sales: 120000
      }]);

// Configuring slices
      series2.slices.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2
      })

// Disabling labels and ticks
      series2.labels.template.set("visible", false);
      series2.ticks.template.set("visible", false);
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

}
