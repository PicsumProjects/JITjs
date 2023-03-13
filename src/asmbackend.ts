/// <reference path="./defs&utils.ts" />

export function asmModule(mod: JITJSModule, name: string): any
{
  
  var i = 0;
  var code = `return function ${name}()\n{\n    "use asm";\n\n    var regsi8 = new Int8Array(64);\n    var regsu8 = new Uint8Array(64);\n    var regsi16 = new Int16Array(64);\n    var regsu16 = new Uint16Array(64);\n    var regsi32 = new Int32Array(64);\n    var regsu32 = new Uint32Array(64);\n    var regsf32 = new Float32Array(64);\n    var regsf64 = new Float64Array(64);\n\n    function getregsi8()\n    {\n        return regsi8;\n    };\n\n    function getregsu8()\n    {\n        return regsu8;\n    };\n\n    function getregsi16()\n    {\n        return regsi16;\n    };\n\n    function getregsu16()\n    {\n        return regsu16;\n    };\n\n    function getregsi32()\n    {\n        return regsi32;\n    };\n\n    function getregsf32()\n    {\n        return regsf32;\n    };\n\n    function getregsf64()\n    {\n        return regsf64;\n    };\n\n\n`;
  for(const func of mod)
      code += asmFunc(func, i++);
  code += '    return {\n';
  while(i--) code += '      $' + i.toString() + ': $' + i.toString() + ',\n';
  return Function(code + '      getregsi8: getregsi8,\n      getregsu8: getregsu8,\n      getregsi16: getregsi16,\n      getregsu16: getregsu16,\n      getregsi32: getregsi32,\n      getregsf32: getregsf32,\n      getregsf64: getregsf64\n    };\n};')()();
};

function asmFunc(instrs: Func, count: number)
{
  let base = `    function $${count}()\n    {\n`;
  for(const instr of instrs.instrs) base += '        ' + asmSingleInstr(instr);
  return base + '    };\n\n';
};

function asmSingleInstr(instr: Instr): string
{
  if(!("asm" in Object.keys(backendList))) backendList["asm"] = asmModule;
  switch(instr.type)
  {
    case 0: // F64ADD
      checkInstr(instr);
      return `regsf64[${instr.args[2]}] = regsf64[${instr.args[0]}] + regsf64[${instr.args[1]}];\n`;
      break;
    case 1: // F64SUB
      checkInstr(instr);
      return `regsf64[${instr.args[2]}] = regsf64[${instr.args[0]}] - regsf64[${instr.args[1]}];\n`;
      break;
    case 2: // F64DIV
      checkInstr(instr);
      return `regsf64[${instr.args[2]}] = regsf64[${instr.args[0]}] / regsf64[${instr.args[1]}];\n`;
      break;
    case 3: // F64MOD
      checkInstr(instr);
      return `regsf64[${instr.args[2]}] = regsf64[${instr.args[0]}] % regsf64[${instr.args[1]}];\n`;
      break;
    case 4: // F64MUL
      checkInstr(instr);
      return `regsf64[${instr.args[2]}] = regsf64[${instr.args[0]}] * regsf64[${instr.args[1]}];\n`;
      break;
    case 5: // F32ADD
      checkInstr(instr);
      return `regsf32[${instr.args[2]}] = regsf32[${instr.args[0]}] + regsf32[${instr.args[1]}];\n`;
      break;
    case 6: // F32SUB
      checkInstr(instr);
      return `regsf32[${instr.args[2]}] = regsf32[${instr.args[0]}] - regsf32[${instr.args[1]}];\n`;
      break;
    case 7: // F32DIV
      checkInstr(instr);
      return `regsf32[${instr.args[2]}] = regsf32[${instr.args[0]}] / regsf32[${instr.args[1]}];\n`;
      break;
    case 8: // F32MOD
      checkInstr(instr);
      return `regsf32[${instr.args[2]}] = regsf32[${instr.args[0]}] % regsf32[${instr.args[1]}];\n`;
      break;
    case 9: // F32MUL
      checkInstr(instr);
      return `regsf32[${instr.args[2]}] = regsf32[${instr.args[0]}] * regsf32[${instr.args[1]}];\n`;
      break;
    case 10: // I32ADD
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] + regsi32[${instr.args[1]}];\n`;
      break;
    case 11: // I32SUB
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] - regsi32[${instr.args[1]}];\n`;
      break;
    case 12: // I32DIV
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] / regsi32[${instr.args[1]}];\n`;
      break;
    case 13: // I32MOD
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] % regsi32[${instr.args[1]}];\n`;
      break;
    case 14: // I32MUL
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] * regsi32[${instr.args[1]}];\n`;
      break;
    case 15: // I32XOR
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] ^ regsi32[${instr.args[1]}];\n`;
      break;
    case 16: // I32OR
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] | regsi32[${instr.args[1]}];\n`;
      break;
    case 17: // I32AND
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] & regsi32[${instr.args[1]}];\n`;
      break;
    case 18: // I32LSHIFT
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] << regsi32[${instr.args[1]}];\n`;
      break;
    case 19: // I32RSHIFT
      checkInstr(instr);
      return `regsi32[${instr.args[2]}] = regsi32[${instr.args[0]}] >> regsi32[${instr.args[1]}];\n`;
      break;
    case 20: // I32NEG
      checkInstr(instr);
      return `regsi32[${instr.args[1]}] = ~regsi32[${instr.args[0]}];\n`;
      break;
    case 21: // U32ADD
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] + regsu32[${instr.args[1]}];\n`;
      break;
    case 22: // U32SUB
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] - regsu32[${instr.args[1]}];\n`;
      break;
    case 23: // U32DIV
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] / regsu32[${instr.args[1]}];\n`;
      break;
    case 24: // U32MOD
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] % regsu32[${instr.args[1]}];\n`;
      break;
    case 25: // U32MUL
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] * regsu32[${instr.args[1]}];\n`;
      break;
    case 26: // U32XOR
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] ^ regsu32[${instr.args[1]}];\n`;
      break;
    case 27: // U32OR
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] | regsu32[${instr.args[1]}];\n`;
      break;
    case 28: // U32AND
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] & regsu32[${instr.args[1]}];\n`;
      break;
    case 29: // U32LSHIFT
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] << regsu32[${instr.args[1]}];\n`;
      break;
    case 30: // U32RSHIFT
      checkInstr(instr);
      return `regsu32[${instr.args[2]}] = regsu32[${instr.args[0]}] >>> regsu32[${instr.args[1]}];\n`;
      break;
    case 31: // U32NEG
      checkInstr(instr);
      return `regsu32[${instr.args[1]}] = ~regsu32[${instr.args[0]}];\n`;
      break;
    case 32: // I16ADD
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] + regsi16[${instr.args[1]}];\n`;
      break;
    case 33: // I16SUB
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] - regsi16[${instr.args[1]}];\n`;
      break;
    case 34: // I16DIV
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] / regsi16[${instr.args[1]}];\n`;
      break;
    case 35: // I16MOD
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] % regsi16[${instr.args[1]}];\n`;
      break;
    case 36: // I16MUL
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] * regsi16[${instr.args[1]}];\n`;
      break;
    case 37: // I16XOR
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] ^ regsi16[${instr.args[1]}];\n`;
      break;
    case 38: // I16OR
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] | regsi16[${instr.args[1]}];\n`;
      break;
    case 39: // I16AND
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] & regsi16[${instr.args[1]}];\n`;
      break;
    case 40: // I16LSHIFT
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] << regsi16[${instr.args[1]}];\n`;
      break;
    case 41: // I16RSHIFT
      checkInstr(instr);
      return `regsi16[${instr.args[2]}] = regsi16[${instr.args[0]}] >> regsi16[${instr.args[1]}];\n`;
      break;
    case 42: // I16NEG
      checkInstr(instr);
      return `regsi16[${instr.args[1]}] = ~regsi16[${instr.args[0]}];\n`;
      break;
    case 43: // U16ADD
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] + regsu16[${instr.args[1]}];\n`;
      break;
    case 44: // U16SUB
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] - regsu16[${instr.args[1]}];\n`;
      break;
    case 45: // U16DIV
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] / regsu16[${instr.args[1]}];\n`;
      break;
    case 46: // U16MOD
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] % regsu16[${instr.args[1]}];\n`;
      break;
    case 47: // U16MUL
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] * regsu16[${instr.args[1]}];\n`;
      break;
    case 48: // U16XOR
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] ^ regsu16[${instr.args[1]}];\n`;
      break;
    case 49: // U16OR
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] | regsu16[${instr.args[1]}];\n`;
      break;
    case 50: // U16AND
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] & regsu16[${instr.args[1]}];\n`;
      break;
    case 51: // U16LSHIFT
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] << regsu16[${instr.args[1]}];\n`;
      break;
    case 52: // U16RSHIFT
      checkInstr(instr);
      return `regsu16[${instr.args[2]}] = regsu16[${instr.args[0]}] >>> regsu16[${instr.args[1]}];\n`;
      break;
    case 53: // U16NEG
      checkInstr(instr);
      return `regsu16[${instr.args[1]}] = ~regsu16[${instr.args[0]}];\n`;
      break;
    case 54: // I8ADD
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] + regsi8[${instr.args[1]}];\n`;
      break;
    case 55: // I8SUB
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] - regsi8[${instr.args[1]}];\n`;
      break;
    case 56: // I8DIV
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] / regsi8[${instr.args[1]}];\n`;
      break;
    case 57: // I8MOD
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] % regsi8[${instr.args[1]}];\n`;
      break;
    case 58: // I8MUL
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] * regsi8[${instr.args[1]}];\n`;
      break;
    case 59: // I8XOR
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] ^ regsi8[${instr.args[1]}];\n`;
      break;
    case 60: // I8OR
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] | regsi8[${instr.args[1]}];\n`;
      break;
    case 61: // I8AND
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] & regsi8[${instr.args[1]}];\n`;
      break;
    case 62: // I8LSHIFT
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] << regsi8[${instr.args[1]}];\n`;
      break;
    case 63: // I8RSHIFT
      checkInstr(instr);
      return `regsi8[${instr.args[2]}] = regsi8[${instr.args[0]}] >> regsi8[${instr.args[1]}];\n`;
      break;
    case 64: // I8NEG
      checkInstr(instr);
      return `regsi8[${instr.args[1]}] = ~regsi8[${instr.args[0]}];\n`;
      break;
    case 65: // U8ADD
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] + regsu8[${instr.args[1]}];\n`;
      break;
    case 66: // U8SUB
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] - regsu8[${instr.args[1]}];\n`;
      break;
    case 67: // U8DIV
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] / regsu8[${instr.args[1]}];\n`;
      break;
    case 68: // U8MOD
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] % regsu8[${instr.args[1]}];\n`;
      break;
    case 69: // U8MUL
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] * regsu8[${instr.args[1]}];\n`;
      break;
    case 70: // U8XOR
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] ^ regsu8[${instr.args[1]}];\n`;
      break;
    case 71: // U8OR
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] | regsu8[${instr.args[1]}];\n`;
      break;
    case 72: // U8AND
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] & regsu8[${instr.args[1]}];\n`;
      break;
    case 73: // U8LSHIFT
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] << regsu8[${instr.args[1]}];\n`;
      break;
    case 74: // U8RSHIFT
      checkInstr(instr);
      return `regsu8[${instr.args[2]}] = regsu8[${instr.args[0]}] >>> regsu8[${instr.args[1]}];\n`;
      break;
    case 75: // U8NEG
      checkInstr(instr);
      return `regsu8[${instr.args[1]}] = ~regsu8[${instr.args[0]}];\n`;
      break;
    case 76: // SETU8
      checkInstr(instr);
      return `regsu8[${instr.args[1]}] = ${(instr.args[0] >>> 0) % 256};\n`;
      break;
    case 77: // SETI8
      checkInstr(instr);
      return `regsi8[${instr.args[1]}] = ${(instr.args[0] >= -128) ? ((instr.args[0] | 0) % 128) : (((instr.args[0] + 128) | 0) - 128)};\n`;
      break;
    case 78: // SETU16
      checkInstr(instr);
      return `regsu16[${instr.args[1]}] = ${(instr.args[0] >>> 0) % 65536};\n`;
      break;
    case 79: // SETI16
      checkInstr(instr);
      return `regsi16[${instr.args[1]}] = ${(instr.args[0] >= -32768) ? ((instr.args[0] | 0) % 32767) : (((instr.args[0] + 32768) | 0) - 32768)};\n`;
      break;
    case 80: // SETU32
      checkInstr(instr);
      return `regsu32[${instr.args[1]}] = ${(instr.args[0] >>> 0) % 4294967296};\n`;
      break;
    case 81: // SETI32
      checkInstr(instr);
      return `regsi32[${instr.args[1]}] = ${(instr.args[0] >= -2147483648) ? ((instr.args[0] | 0) % 2147483647) : (((instr.args[0] + 2147483648) | 0) - 2147483648)};\n`;
      break;
    case 82: // SETF32
      checkInstr(instr);
      return `regsf32[${instr.args[1]}] = ${+instr.args[0]};\n`;
      break;
    case 83: // SETF64
      checkInstr(instr);
      return `regsf64[${instr.args[1]}] = ${+instr.args[0]};\n`;
      break;
    case 84: // CALL
      checkInstr(instr);
      return `$${instr.args[0] >>> 0}();\n`;
      break;
    case 85: // RET
      checkInstr(instr);
      return "return;\n";
      break;
    case 86: // CONVF64F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 87: // CONVF64I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 88: // CONVF64U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 89: // CONVF64I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 90: // CONVF64U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 91: // CONVF64I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 92: // CONVF64U8
      checkInstr(instr);
      return `regsu8[${instr.args[0]}] = regsf64[${instr.args[1]}];\n`;
      break;
    case 93: // CONVF32F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 94: // CONVF32I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 95: // CONVF32U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 96: // CONVF32I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 97: // CONVF32U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 98: // CONVF32I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 99: // CONVF32U8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsf32[${instr.args[1]}];\n`;
      break;
    case 100: // CONVI32F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 101: // CONVI32F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 102: // CONVI32U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 103: // CONVI32I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 104: // CONVI32U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 105: // CONVI32I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 106: // CONVI32U8
      checkInstr(instr);
      return `regsu8[${instr.args[0]}] = regsi32[${instr.args[1]}];\n`;
      break;
    case 107: // CONVU32F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 108: // CONVU32F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 109: // CONVU32I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 110: // CONVU32I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 111: // CONVU32U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 112: // CONVU32I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 113: // CONVU32U8
      checkInstr(instr);
      return `regsu8[${instr.args[0]}] = regsu32[${instr.args[1]}];\n`;
      break;
    case 114: // CONVI16F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 115: // CONVI16F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 116: // CONVI16I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 117: // CONVI16U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 118: // CONVI16U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 119: // CONVI16I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 120: // CONVI16U8
      checkInstr(instr);
      return `regsu8[${instr.args[0]}] = regsi16[${instr.args[1]}];\n`;
      break;
    case 121: // CONVU16F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 122: // CONVU16F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 123: // CONVU16I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 124: // CONVU16U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 125: // CONVU16I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 126: // CONVU16I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 127: // CONVU16U8
      checkInstr(instr);
      return `regsu8[${instr.args[0]}] = regsu16[${instr.args[1]}];\n`;
      break;
    case 128: // CONVI8F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 129: // CONVI8F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 130: // CONVI8I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 131: // CONVI8U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 132: // CONVI8I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 133: // CONVI8U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 134: // CONVI8U8
      checkInstr(instr);
      return `regsu8[${instr.args[0]}] = regsi8[${instr.args[1]}];\n`;
      break;
    case 135: // CONVU8F64
      checkInstr(instr);
      return `regsf64[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 136: // CONVU8F32
      checkInstr(instr);
      return `regsf32[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 137: // CONVU8I32
      checkInstr(instr);
      return `regsi32[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 138: // CONVU8U32
      checkInstr(instr);
      return `regsu32[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 139: // CONVU8I16
      checkInstr(instr);
      return `regsi16[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 140: // CONVU8U16
      checkInstr(instr);
      return `regsu16[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 141: // CONVU8I8
      checkInstr(instr);
      return `regsi8[${instr.args[0]}] = regsu8[${instr.args[1]}];\n`;
      break;
    case 142: // IFCALL
      checkInstr(instr);
      return `if(regsi8[${instr.args[0]}]) $${instr.args[1]}();\n`;
      break;
    default:
      checkInstr(instr);
      return '';
      break;
  }
};


backendList['asm'] = asmModule;
