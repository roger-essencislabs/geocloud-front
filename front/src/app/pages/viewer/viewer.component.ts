import {Component,AfterViewInit,ViewEncapsulation,OnDestroy,} from "@angular/core";
import OpenSeadragon from "openseadragon";
import { createOSDAnnotator } from "@annotorious/openseadragon";
import type { Annotation, OpenSeadragonAnnotator } from "@annotorious/openseadragon";
import "@annotorious/openseadragon/annotorious-openseadragon.css";
import { CommonModule } from "@angular/common";


@Component({
  selector: "app-viewer",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./viewer.component.html",
  styleUrls: ["./viewer.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewerComponent implements AfterViewInit, OnDestroy {
  private viewer!: OpenSeadragon.Viewer;
  private anno!: OpenSeadragonAnnotator;

  public drawingMode = false;
  public selectedTool: 'rectangle' | 'polygon' = 'rectangle';;
  selectedId: string | null = null;

  ngAfterViewInit(): void {
    this.viewer = OpenSeadragon({
      id: "openseadragon-container",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources:
        "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi",
      gestureSettingsMouse: {clickToZoom: false},
      autoHideControls: false,
    });

    this.viewer.addHandler("open", () => {
      this.anno = createOSDAnnotator(this.viewer, {
        drawingEnabled: false,
      });

      // Quando criar um quadrado, mostramos o ID
      this.anno.on("createAnnotation", (annotation: Annotation) => {
        console.log("Anotação criada:", annotation.id);
      });

      // Ao selecionar, pergunta e remove
      (this.anno as any).on("select", (annotation: Annotation | undefined) => {
        this.selectedId = annotation ? annotation.id : null;
      });
    });
  }

  // Função para remover manualmente pelo ID
  toggleDrawingMode(tool: 'rectangle' | 'polygon'): void {
    this.selectedTool = tool;
    this.drawingMode= !this.drawingMode;

    this.anno.setDrawingTool(tool);
    this.anno.setDrawingEnabled(this.drawingMode);

    if(this.drawingMode) this.selectedId = null;
  }

  deleteSelected(): void{
    if (!this.selectedId) return;
    const ok = confirm("Deseja excluir essa anotação?");
    if (ok){
      this.anno.removeAnnotation(this.selectedId);
      this.selectedId = null
    }
  }

  ngOnDestroy(): void {
    this.anno?.destroy();
    this.viewer?.destroy();
  }
}
