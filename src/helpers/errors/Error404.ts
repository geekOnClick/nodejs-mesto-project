import {HTTP_STATUS_NOT_FOUND} from "../../utils/constants";

class Error404 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

export default Error404;
