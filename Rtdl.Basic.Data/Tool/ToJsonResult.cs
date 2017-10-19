using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rtdl.Basic.Model;

namespace Rtdl.Basic.Data
{
    public class ToJsonResult
    {
        /// <summary>
        /// 返回
        /// </summary>
        /// <param name="Return"></param>
        /// <param name="Msg"></param>
        /// <returns></returns>
        public static string GetR(int Return, string Msg)
        {
            SysResult sr = new SysResult
            {
                Return = Return,
                Msg = Msg
            };
            return "{\"Return\":\"" + Return + "\",\"Msg\":\"" + Msg + "\"}";
        }
    }
}
