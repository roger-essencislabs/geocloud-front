import { Component, OnInit } from '@angular/core';
import { RootReducerState } from '../store';
import { Store } from '@ngrx/store';
import { VerticalComponent } from './vertical/vertical.component';
import { TwoColumnComponent } from './two-column/two-column.component';
import { HorizontalComponent } from './horizontal/horizontal.component';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [
        VerticalComponent,
        HorizontalComponent,
        TwoColumnComponent
      ]
})

export class LayoutComponent implements OnInit {

  layoutType!: string;

  constructor(private store: Store<RootReducerState>) { }

  ngOnInit(): void {
    this.store.select('layout').subscribe((data) => {
      this.layoutType = data.LAYOUT;
      document.documentElement.setAttribute('data-layout', data.LAYOUT);
      document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_MODE);
      document.documentElement.setAttribute('data-layout-width', data.LAYOUT_WIDTH);
      document.documentElement.setAttribute('data-layout-position', data.LAYOUT_POSITION);
      document.documentElement.setAttribute('data-topbar', data.TOPBAR);
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR) : '';
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar-image', data.SIDEBAR_IMAGE) : '';
      data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-layout-style', data.SIDEBAR_VIEW) : '';
      document.documentElement.setAttribute('data-preloader', data.DATA_PRELOADER)
      document.documentElement.setAttribute('data-sidebar-visibility', data.SIDEBAR_VISIBILITY);
    })

  }

  isVerticalLayoutRequested() {
    return this.layoutType === 'vertical';
  }

  isSemiboxLayoutRequested() {
    return this.layoutType === 'semibox';
  }

  isHorizontalLayoutRequested() {
    return this.layoutType === 'horizontal';
  }

  isTwoColumnLayoutRequested() {
    return this.layoutType === 'twocolumn';
  }

}
