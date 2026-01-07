export enum SocketState {
    /** 网络连接中 */
    CONNECTING = WebSocket.CONNECTING,
    /** 网络已连接 */
    CONNECTED = WebSocket.OPEN,
    /** 网络关闭中 */
    CLOSING = WebSocket.CLOSING,
    /** 网络已关闭 */
    CLOSED = WebSocket.CLOSED,
    /** 网络发生错误 */
    ERROR = WebSocket.CLOSED + 1,
    /** 网络接收到数据 */
    MESSAGE = WebSocket.CLOSED + 2
}
