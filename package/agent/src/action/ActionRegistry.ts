import { Action } from "./Action";
import { DoneAction } from "./DoneAction";
import { ActionFormat } from "./format/ActionFormat";

export class ActionRegistry {
  readonly format: ActionFormat;
  readonly doneAction: Action<any, any>;

  private readonly actions: Map<string, Action<any, any>> = new Map();

  constructor({
    actions,
    doneAction = new DoneAction(),
    format,
  }: {
    actions: Action<any, any>[];
    doneAction?: Action<any, any>;
    format: ActionFormat;
  }) {
    for (const action of actions) {
      this.register(action);
    }

    this.doneAction = doneAction;
    this.format = format;
  }

  register(action: Action<any, any>) {
    if (this.actions.has(action.type)) {
      throw new Error(
        `An action with the type '${action.type}' has already been registered.`
      );
    }

    this.actions.set(action.type, action);
  }

  getAction(type: string) {
    const action = this.actions.get(type);

    if (action == null && type === this.doneAction.type) {
      return this.doneAction;
    }

    if (!action) {
      throw new Error(
        `No action with the type '${type}' has been registered. ${this.availableActionTypesMessage}`
      );
    }

    return action;
  }

  getAvailableActionInstructions() {
    return `You can perform the following actions using ${
      this.format.description
    }:

${this.describeActions()}

## RESPONSE FORMAT (ALWAYS USE THIS FORMAT)

Explain and describe your reasoning step by step.
Then use the following format to specify the action you want to perform next:

${this.format.format({
  action: "an action",
  param1: "a parameter value",
  param2: "another parameter value",
})}

You must always use exactly one action with the correct syntax per response.
Each response must precisely follow the action syntax.`;
  }

  private get availableActionTypesMessage() {
    return `Available actions: ${this.actionTypes.join(", ")}`;
  }

  get actionTypes() {
    return [Array.from(this.actions.keys()), this.doneAction.type].flat();
  }

  describeActions() {
    return [...Array.from(this.actions.values()), this.doneAction]
      .map(
        (action) =>
          `### ${action.type}\n${
            action.description
          }\nSyntax:\n${this.format.format(
            Object.assign(
              {
                action: action.type,
              },
              action.inputExample
            )
          )}`
      )
      .join("\n\n");
  }
}
