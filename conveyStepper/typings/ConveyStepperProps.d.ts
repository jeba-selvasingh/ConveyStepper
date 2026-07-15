/**
 * This file was generated from ConveyStepper.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ActionValue, DynamicValue, WebIcon } from "mendix";
import { Big } from "big.js";
import { CSSProperties } from "react";

export interface StepsType {
    caption: DynamicValue<string>;
    enabled: DynamicValue<boolean>;
    onClick?: ActionValue;
}

export interface StepsPreviewType {
    caption: string;
    enabled: string;
    onClick: {} | null;
}

export interface ConveyStepperContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    activeStep: DynamicValue<Big>;
    steps: StepsType[];
    showHeader: boolean;
    headerTitle?: DynamicValue<string>;
    headerIcon?: DynamicValue<WebIcon>;
    showPopOutButton: boolean;
    onPopOut?: ActionValue;
    showCloseButton: boolean;
    onClose?: ActionValue;
    completedColor: string;
    activeColor: string;
    pendingFillColor: string;
    pendingBorderColor: string;
    connectorColor: string;
    textColor: string;
    headerBackgroundColor: string;
}

export interface ConveyStepperPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    activeStep: string;
    steps: StepsPreviewType[];
    showHeader: boolean;
    headerTitle: string;
    headerIcon:
        | { type: "glyph"; iconClass: string }
        | { type: "image"; imageUrl: string; iconUrl: string }
        | { type: "icon"; iconClass: string }
        | undefined;
    showPopOutButton: boolean;
    onPopOut: {} | null;
    showCloseButton: boolean;
    onClose: {} | null;
    completedColor: string;
    activeColor: string;
    pendingFillColor: string;
    pendingBorderColor: string;
    connectorColor: string;
    textColor: string;
    headerBackgroundColor: string;
}
