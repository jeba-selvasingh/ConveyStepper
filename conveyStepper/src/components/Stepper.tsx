import { CSSProperties, ReactElement, KeyboardEvent, MouseEvent } from "react";
import classNames from "classnames";
import { Icon } from "mendix/components/web/Icon";
import { WebIcon } from "mendix";

export type StepState = "completed" | "active" | "pending";

export interface StepperStep {
    caption: string;
    enabled: boolean;
    onClick?: () => void;
}

export interface StepperColors {
    completed: string;
    active: string;
    pendingFill: string;
    pendingBorder: string;
    connector: string;
    text: string;
    headerBackground: string;
}

export interface StepperHeaderConfig {
    title: string;
    icon?: WebIcon;
    showPopOutButton: boolean;
    onPopOut?: () => void;
    showCloseButton: boolean;
    onClose?: () => void;
}

export interface StepperProps {
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
    activeStep: number;
    steps: StepperStep[];
    colors: StepperColors;
    header?: StepperHeaderConfig | null;
}

function getStepState(index: number, activeStep: number): StepState {
    const stepNumber = index + 1;
    if (stepNumber < activeStep) {
        return "completed";
    }
    if (stepNumber === activeStep) {
        return "active";
    }
    return "pending";
}

function CheckIcon(): ReactElement {
    return (
        <svg className="convey-stepper__check" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path d="M4.8 9.2 1.6 6l1.1-1.1 2.1 2.1 4.5-4.5L10.4 3.6 4.8 9.2z" fill="currentColor" />
        </svg>
    );
}

function PhoneIcon(): ReactElement {
    return (
        <svg className="convey-stepper__header-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
            />
        </svg>
    );
}

function PopOutIcon(): ReactElement {
    return (
        <svg className="convey-stepper__header-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
        </svg>
    );
}

function CloseIcon(): ReactElement {
    return (
        <svg className="convey-stepper__header-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z"
            />
        </svg>
    );
}

function HeaderBar({ header }: { header: StepperHeaderConfig }): ReactElement {
    const hasActions = header.showPopOutButton || header.showCloseButton;

    return (
        <div className="convey-stepper__header">
            <div className="convey-stepper__header-title">
                <span className="convey-stepper__header-icon" aria-hidden="true">
                    {header.icon ? <Icon icon={header.icon} /> : <PhoneIcon />}
                </span>
                <span className="convey-stepper__header-text">{header.title}</span>
            </div>
            {hasActions ? (
                <div className="convey-stepper__header-actions">
                    {header.showPopOutButton ? (
                        <button
                            type="button"
                            className="convey-stepper__header-btn"
                            aria-label="Pop out"
                            onClick={() => header.onPopOut?.()}
                        >
                            <PopOutIcon />
                        </button>
                    ) : null}
                    {header.showCloseButton ? (
                        <button
                            type="button"
                            className="convey-stepper__header-btn"
                            aria-label="Close"
                            onClick={() => header.onClose?.()}
                        >
                            <CloseIcon />
                        </button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

function activateStep(step: StepperStep, event?: MouseEvent | KeyboardEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (!step.enabled || !step.onClick) {
        return;
    }
    step.onClick();
}

export function Stepper({ className, style, tabIndex, activeStep, steps, colors, header }: StepperProps): ReactElement {
    const safeActiveStep = Number.isFinite(activeStep) && activeStep > 0 ? Math.floor(activeStep) : 1;

    const colorStyle: CSSProperties = {
        ...style,
        ["--convey-stepper-completed" as string]: colors.completed,
        ["--convey-stepper-active" as string]: colors.active,
        ["--convey-stepper-pending-fill" as string]: colors.pendingFill,
        ["--convey-stepper-pending-border" as string]: colors.pendingBorder,
        ["--convey-stepper-connector" as string]: colors.connector,
        ["--convey-stepper-text" as string]: colors.text,
        ["--convey-stepper-header-bg" as string]: colors.headerBackground
    };

    return (
        <div className={classNames("convey-stepper", className)} style={colorStyle} tabIndex={tabIndex}>
            {header ? <HeaderBar header={header} /> : null}
            <nav className="convey-stepper__body" aria-label="Progress">
                <ol className="convey-stepper__list">
                    {steps.map((step, index) => {
                        const state = getStepState(index, safeActiveStep);
                        const stepNumber = index + 1;
                        const isLast = index === steps.length - 1;
                        const connectorCompleted = stepNumber < safeActiveStep;
                        const clickable = step.enabled && !!step.onClick;

                        return (
                            <li
                                key={index}
                                className={classNames("convey-stepper__item", `convey-stepper__item--${state}`, {
                                    "convey-stepper__item--last": isLast,
                                    "convey-stepper__item--connector-completed": !isLast && connectorCompleted,
                                    "convey-stepper__item--clickable": clickable,
                                    "convey-stepper__item--disabled": !step.enabled
                                })}
                            >
                                <button
                                    type="button"
                                    className={classNames("convey-stepper__node", `convey-stepper__node--${state}`)}
                                    aria-current={state === "active" ? "step" : undefined}
                                    aria-label={`Step ${stepNumber}: ${step.caption || "Untitled"}`}
                                    aria-disabled={!clickable}
                                    disabled={!clickable}
                                    onClick={event => activateStep(step, event)}
                                    onKeyDown={event => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            activateStep(step, event);
                                        }
                                    }}
                                >
                                    {state === "completed" ? <CheckIcon /> : null}
                                </button>
                                {state === "active" ? (
                                    <div className="convey-stepper__label">
                                        <span className="convey-stepper__badge">{`Step ${stepNumber}`}</span>
                                        <span className="convey-stepper__caption">{step.caption}</span>
                                    </div>
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}
