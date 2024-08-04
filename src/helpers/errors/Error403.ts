import {HTTP_STATUS_FORBIDDEN} from "../../utils/constants";

class Error403 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

export default Error403;
