import { ReactElement } from "react";
import { ActionValue } from "mendix";
import { Stepper, StepperColors } from "./components/Stepper";
import { ConveyStepperContainerProps } from "../typings/ConveyStepperProps";

import "./ui/ConveyStepper.css";

function toNumber(value: unknown, fallback = 1): number {
    if (value == null) {
        return fallback;
    }
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "object" && "toNumber" in (value as object)) {
        return (value as { toNumber: () => number }).toNumber();
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function runAction(action?: ActionValue): void {
    if (action && action.canExecute) {
        action.execute();
    }
}

function withFallback(color: string | undefined, fallback: string): string {
    const trimmed = color?.trim();
    return trimmed ? trimmed : fallback;
}

export function ConveyStepper(props: ConveyStepperContainerProps): ReactElement {
    const {
        class: className,
        style,
        tabIndex,
        activeStep,
        steps,
        showHeader,
        headerTitle,
        headerIcon,
        showPopOutButton,
        onPopOut,
        showCloseButton,
        onClose,
        completedColor,
        activeColor,
        pendingFillColor,
        pendingBorderColor,
        connectorColor,
        textColor,
        headerBackgroundColor
    } = props;

    const colors: StepperColors = {
        completed: withFallback(completedColor, "#26a69a"),
        active: withFallback(activeColor, "#44566c"),
        pendingFill: withFallback(pendingFillColor, "#eef1f4"),
        pendingBorder: withFallback(pendingBorderColor, "#c5ccd4"),
        connector: withFallback(connectorColor, "#d5dae0"),
        text: withFallback(textColor, "#1f2a37"),
        headerBackground: withFallback(headerBackgroundColor, "#f5f7fa")
    };

    if (!steps || steps.length === 0) {
        return (
            <div className={`convey-stepper ${className}`.trim()} style={style} tabIndex={tabIndex}>
                {showHeader ? (
                    <div className="convey-stepper__header">
                        <div className="convey-stepper__header-title">
                            <span className="convey-stepper__header-text">
                                {headerTitle?.value || "Inbound Call Process"}
                            </span>
                        </div>
                    </div>
                ) : null}
                <div className="convey-stepper__empty">Configure at least one step</div>
            </div>
        );
    }

    const currentStep = toNumber(activeStep?.value, 1);

    return (
        <Stepper
            className={className}
            style={style}
            tabIndex={tabIndex}
            activeStep={currentStep}
            colors={colors}
            header={
                showHeader
                    ? {
                          title: headerTitle?.value || "Inbound Call Process",
                          icon: headerIcon?.value,
                          showPopOutButton,
                          onPopOut: () => runAction(onPopOut),
                          showCloseButton,
                          onClose: () => runAction(onClose)
                      }
                    : null
            }
            steps={steps.map(step => ({
                caption: step.caption?.value ?? "",
                enabled: step.enabled?.value !== false,
                onClick: step.onClick
                    ? () => {
                          runAction(step.onClick);
                      }
                    : undefined
            }))}
        />
    );
}
