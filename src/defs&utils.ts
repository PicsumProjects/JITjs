export const LASTINSTR = 142;
export type Instr = {
  type: number = -1;
  args: number[] = [];
};

export type Func = {
  id: bigint = 0n;
  instrs: Instr[] = [];
};

export type JITJSModule = Func[];

function checkInstr(instr: Instr): void
{
  for(const arg of instr.args)
    if((((arg >>> 0) > 64) || ((arg >>> 0) !== arg)) && (!((instr.type > 75) && (instr.type < 84)))) throw new Error('Invalid instruction');
  if((instr.type >>> 0) > LASTINSTR) throw new Error('Invalid instruction');
};      
