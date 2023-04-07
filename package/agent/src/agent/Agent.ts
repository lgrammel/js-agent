import { ActionRegistry } from "../action/ActionRegistry";

export class Agent {
  readonly name: string;
  readonly role: string;
  readonly constraints: string;
  readonly actionRegistry: ActionRegistry;

  constructor({
    name,
    role,
    constraints,
    actionRegistry,
  }: {
    name: string;
    role: string;
    constraints: string;
    actionRegistry: ActionRegistry;
  }) {
    this.name = name;
    this.role = role;
    this.constraints = constraints;
    this.actionRegistry = actionRegistry;
  }
}
