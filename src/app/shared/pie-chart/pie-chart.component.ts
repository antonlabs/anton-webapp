import {AfterViewInit, Component, Inject, Input, NgZone, OnInit, PLATFORM_ID} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";

import {isPlatformBrowser} from "@angular/common";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {SymbolMarket} from "../../market/models/market.model";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {

  private _values: SymbolMarket[] | undefined;

  label: any;

  get values(): SymbolMarket[] | undefined {
    return this._values;
  }

  @Input()
  set values(val: SymbolMarket[] | undefined) {
    this._values = val;
    this.renderPieChart();
  };

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
  }

  renderPieChart(): void {
    // Chart code goes in here

    this.browserOnly(() => {
      if(this.values === undefined || this.values.length === 0) return;
      const values = this.values.filter(item => item.risk && item.price !== 'N/A');
      let budget = 0;
      for(const value of values) {
        budget += value.qty ? (parseFloat(value.price) * value.qty) : 0;
      }
      if(!this.root) {
        this.root = am5.Root.new("chartdiv");
      }
      this.root.setThemes([
          am5themes_Animated.new(this.root)
      ]);
      if(!this.label) {
        this.label = this.root.tooltipContainer.children.push(am5.Label.new(this.root, {
          x: am5.p50,
          y: am5.p50,
          text: Math.floor(budget) + '$',
          centerX: am5.p50,
          centerY: am5.p50,
          fill: am5.color(0x000000),
          fontSize: 50
        } as any));
      }else {
        this.label.set("text", Math.floor(budget) + '$');
      }

      this.root.container.children.pop();
      const chart = this.root.container.children.push(
        am5percent.PieChart.new(this.root, ({
          radius: am5.percent(90),
          innerRadius: am5.percent(50)
        } as any))
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(this.root, {
          name: "Series",
          valueField: "percentage",
          categoryField: "crypto"
        })
      );
      let totalQty = 0;
      for(const value of values) {
        totalQty += (value.qty ?? 0) * parseFloat(value.price);
      }
      series.data.setAll(values.filter((v) => !isNaN(Number(v.price))).map(v => ({
        percentage: (((v.qty ?? 0) * parseFloat(v.price)) / totalQty),
        crypto: v.symbol
      })));

      series.slices.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2
      });

      series.labels.template.set("visible", false);
      series.ticks.template.set("visible", false);

      const series2 = chart.series.push(
        am5percent.PieSeries.new(this.root, {
          name: "Series",
          valueField: "percentage",
          categoryField: "risk"
        })
      );
      let highRiskSum = 0;
      const highRisk = values.filter(v => v.risk === 'HIGH');
      highRisk.forEach(i => highRiskSum += (i.qty ?? 0) * parseFloat(i.price));
      let mediumRiskSum = 0;
      const mediumRisk = values.filter(v => v.risk === 'MEDIUM');
      mediumRisk.forEach(i => mediumRiskSum += (i.qty ?? 0) * parseFloat(i.price));
      let lowRiskSum = 0;
      const lowRisk = values.filter(v => v.risk === 'LOW');
      lowRisk.forEach(i => lowRiskSum += (i.qty ?? 0) * parseFloat(i.price));
      let stableRiskSum = 0;
      const stableRisk = values.filter(v => v.risk === 'STABLE');
      stableRisk.forEach(i => stableRiskSum += (i.qty ?? 0) * parseFloat(i.price));
      const percentage = (partial: number, total: number): number => (partial / total) * 100;
      console.log(highRiskSum, mediumRiskSum, lowRiskSum, totalQty, percentage(lowRiskSum, totalQty))
      series2.data.setAll([{
        risk: "High",
        percentage: percentage(highRiskSum, totalQty)
      }, {
        risk: "Medium",
        percentage: percentage(mediumRiskSum, totalQty)
      }, {
        risk: "Low",
        percentage: percentage(lowRiskSum, totalQty)
      }, {
        risk: "Stable",
        percentage: percentage(stableRiskSum, totalQty)
      }]);
      series2.slices.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2
      })

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
