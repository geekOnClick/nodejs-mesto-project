import {STATUS_CODES} from "../../utils/constants";

class Error409 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODES.Error409;
  }
}

export default Error409;
