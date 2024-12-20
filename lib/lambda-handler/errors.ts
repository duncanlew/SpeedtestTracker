export class SpeedtestTrackerValidationError extends Error {
  public readonly name: string;

  constructor(message: string) {
    super(message);
    this.name = "SpeedtestTrackerValidationError";
    Object.setPrototypeOf(this, SpeedtestTrackerValidationError.prototype);
  }
}
