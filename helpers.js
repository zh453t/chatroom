import fs from 'fs'
/**
 * reset
 * @param {string} filepath
 */
export function resetFile(filepath) {
  fs.writeFile(filepath, "[]", "utf-8", (err) => {
    if (err) console.error(err);
  });
}

/**
 * 发送响应：服务器内部错误
 * @param {import('express').Response} response
 * @param {string} errMsg
 */
export function sendErrorResponse(response, errMsg) {
  response.status(500).send(errMsg);
}

/**
 * 检查格式是否正确
 * @param {{}} req 
 * @param {string[]} properties 
 * 
 */
export function syntaxIsValid(obj, properties) {
	return properties.every((property) => {
		for (const propOfReq in obj) {      
			if (property === propOfReq) return true
		}
    return false
	})
	
}
