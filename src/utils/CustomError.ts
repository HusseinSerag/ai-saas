export default class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly errorCode: number = 500
  ) {
    super(message);
  }
}
