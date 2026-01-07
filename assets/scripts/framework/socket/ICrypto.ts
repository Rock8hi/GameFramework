/**
 * 加密解密器接口
 */
export interface ICrypto {
    /**
     * 加密数据
     * @param data 数据
     * @returns 加密后的数据
     */
    Encrypt(data: any): any;
    /**
     * 解密数据
     * @param data 数据
     * @returns 解密后的数据
     */
    Decrypt(data: any): any;
}
