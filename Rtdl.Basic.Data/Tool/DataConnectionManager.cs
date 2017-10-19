using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using com.seascape.db;
using com.seascape.tools;

namespace Rtdl.Basic.Data
{
    /// <summary>
    /// 数据链接管理类
    /// </summary>
    public class DataConnectionManager
    {
        static List<DbHelper> HelperList = new List<DbHelper>();

        public static DbHelper GetHelper()
        {
            DbHelper helper = null;
            if (HelperList.Count < 5)
            {
                helper = new MySqlHelper(BasicTool.GetConnectionstring("WeiXinFix"));
                HelperList.Add(helper);
            }
            else
            {
                Random r=new Random(DateTime.Now.Millisecond);
                helper= HelperList[r.Next(0,4)];
            }
            return helper;
        }
    }
}
