import {HTTP_STATUS_UNAUTHORIZED} from "../../utils/constants";

class Error401 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

export default Error401;
