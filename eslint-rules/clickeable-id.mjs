const requireIdOnClickableRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Elements should have a descriptive element id if they are clickable",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const clickableComponents = [
          "Button",
          "Checkbox",
          "Switch",
          "DropdownMenu",
          "Avatar",
          "Dialog",
          "RadioGroup",
          "SelectTrigger",
          "Tabs",
          "Toggle",
          "ToggleGroup",
          "Tooltip",
          "Input",
          "Textarea",
          //add more if needed
        ];

        const elementName = node.name.name;
        const isCustomClickable = clickableComponents.includes(elementName);

        const hasOnClick = node.attributes.some(
          (attr) => attr.name?.name === "onClick"
        );

        const hasIdOrTestId = node.attributes.some((attr) => {
          const name = attr.name?.name;
          return name === "id";
        });

        if ((isCustomClickable || hasOnClick) && !hasIdOrTestId) {
          context.report({
            node,
            message: `<${elementName}> is without a descriptive 'id'.`,
          });
        }
      },
    };
  },
};

export default requireIdOnClickableRule;
