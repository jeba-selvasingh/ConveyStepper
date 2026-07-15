import { ReactElement } from "react";
import { Stepper } from "./components/Stepper";
import { ConveyStepperPreviewProps } from "../typings/ConveyStepperProps";

function withFallback(color: string | undefined, fallback: string): string {
    const trimmed = color?.trim();
    return trimmed ? trimmed : fallback;
}

export function preview(props: ConveyStepperPreviewProps): ReactElement {
    const {
        className,
        styleObject,
        activeStep,
        steps,
        showHeader,
        headerTitle,
        showPopOutButton,
        showCloseButton,
        completedColor,
        activeColor,
        pendingFillColor,
        pendingBorderColor,
        connectorColor,
        textColor,
        headerBackgroundColor
    } = props;

    const parsedActiveStep = Number(activeStep);
    const safeActiveStep = Number.isFinite(parsedActiveStep) && parsedActiveStep > 0 ? parsedActiveStep : 1;

    const previewSteps =
        steps && steps.length > 0
            ? steps.map(step => ({
                  caption: step.caption || "Step caption",
                  enabled: String(step.enabled).toLowerCase() !== "false",
                  onClick: undefined
              }))
            : [
                  { caption: "Search or Add Member", enabled: true },
                  { caption: "Verify PHI", enabled: true },
                  { caption: "Reason For Call", enabled: false },
                  { caption: "Summary", enabled: false }
              ];

    return (
        <Stepper
            className={className}
            style={styleObject}
            activeStep={Math.min(safeActiveStep, previewSteps.length)}
            colors={{
                completed: withFallback(completedColor, "#26a69a"),
                active: withFallback(activeColor, "#44566c"),
                pendingFill: withFallback(pendingFillColor, "#eef1f4"),
                pendingBorder: withFallback(pendingBorderColor, "#c5ccd4"),
                connector: withFallback(connectorColor, "#d5dae0"),
                text: withFallback(textColor, "#1f2a37"),
                headerBackground: withFallback(headerBackgroundColor, "#f5f7fa")
            }}
            header={
                showHeader
                    ? {
                          title: headerTitle || "Inbound Call Process",
                          showPopOutButton,
                          showCloseButton
                      }
                    : null
            }
            steps={previewSteps}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/ConveyStepper.css");
}
