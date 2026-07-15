import { ConveyStepperPreviewProps } from "../typings/ConveyStepperProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[];
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[];
};

export type Problem = {
    property?: string;
    severity?: "error" | "warning" | "deprecation";
    message: string;
    studioMessage?: string;
    url?: string;
    studioUrl?: string;
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number;
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string;
    data?: string;
    property?: object;
    width?: number;
    height?: number;
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[];
    borders?: boolean;
    borderRadius?: number;
    backgroundColor?: string;
    borderWidth?: number;
    padding?: number;
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow";
};

type TextProps = BaseProps & {
    type: "Text";
    content: string;
    fontSize?: number;
    fontColor?: string;
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object;
    placeholder: string;
    showDataSourceHeader?: boolean;
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object;
    child: PreviewProps;
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null;
    child?: PreviewProps;
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

function findProperty(props: Properties, key: string): Property | undefined {
    for (const group of props) {
        const property = group.properties?.find(prop => prop.key === key);
        if (property) {
            return property;
        }
        if (group.propertyGroups) {
            const nested = findProperty(group.propertyGroups, key);
            if (nested) {
                return nested;
            }
        }
    }
    return undefined;
}

function hideProperty(props: Properties, key: string): void {
    for (const group of props) {
        if (group.properties) {
            group.properties = group.properties.filter(prop => prop.key !== key);
        }
        if (group.propertyGroups) {
            hideProperty(group.propertyGroups, key);
        }
    }
}

export function getProperties(values: ConveyStepperPreviewProps, defaultProperties: Properties): Properties {
    const stepsProperty = findProperty(defaultProperties, "steps");
    if (stepsProperty) {
        stepsProperty.objectHeaders = ["Caption", "Enabled"];
        stepsProperty.objects?.forEach((item, index) => {
            const step = values.steps?.[index];
            const caption = step?.caption?.trim() || `Step ${index + 1}`;
            const enabled = String(step?.enabled ?? "true");
            item.captions = [caption, enabled];
        });
    }

    if (!values.showHeader) {
        hideProperty(defaultProperties, "headerTitle");
        hideProperty(defaultProperties, "headerIcon");
        hideProperty(defaultProperties, "showPopOutButton");
        hideProperty(defaultProperties, "onPopOut");
        hideProperty(defaultProperties, "showCloseButton");
        hideProperty(defaultProperties, "onClose");
        hideProperty(defaultProperties, "headerBackgroundColor");
    } else {
        if (!values.showPopOutButton) {
            hideProperty(defaultProperties, "onPopOut");
        }
        if (!values.showCloseButton) {
            hideProperty(defaultProperties, "onClose");
        }
    }

    return defaultProperties;
}

export function check(values: ConveyStepperPreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (!values.steps || values.steps.length === 0) {
        errors.push({
            property: "steps",
            message: "Add at least one step"
        });
    }

    const activeStep = Number(values.activeStep);
    if (values.steps?.length && Number.isFinite(activeStep)) {
        if (activeStep < 1 || activeStep > values.steps.length) {
            errors.push({
                property: "activeStep",
                severity: "warning",
                message: `Active step should be between 1 and ${values.steps.length}`
            });
        }
    }

    if (values.showHeader && values.showPopOutButton && !values.onPopOut) {
        errors.push({
            property: "onPopOut",
            severity: "warning",
            message: "Pop-out button is shown but On pop-out has no action"
        });
    }

    if (values.showHeader && values.showCloseButton && !values.onClose) {
        errors.push({
            property: "onClose",
            severity: "warning",
            message: "Close button is shown but On close has no action"
        });
    }

    return errors;
}

export function getPreview(values: ConveyStepperPreviewProps): PreviewProps {
    const stepCount = values.steps?.length || 0;
    const title = values.showHeader ? values.headerTitle || "Inbound Call Process" : "Convey Stepper";
    const subtitle =
        stepCount > 0 ? values.steps.map(step => step.caption || "Untitled").join(" → ") : "No steps configured";

    return {
        type: "Container",
        borders: true,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        padding: 8,
        children: [
            {
                type: "Text",
                content: title,
                fontSize: 10,
                bold: true
            },
            {
                type: "Text",
                content: subtitle,
                fontSize: 9,
                fontColor: "#667085"
            }
        ]
    };
}

export function getCustomCaption(values: ConveyStepperPreviewProps): string {
    const count = values.steps?.length ?? 0;
    return count > 0 ? `Convey Stepper (${count})` : "Convey Stepper";
}
