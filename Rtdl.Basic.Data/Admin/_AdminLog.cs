using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Basic.Model;

namespace Rtdl.Basic.Data
{
    public class _AdminLog:DbCenter
    {
        
        public List<adminLogInfo> GetLogList(string sql, string sql_c, out int Count)
        {
            List<adminLogInfo> ls = new List<adminLogInfo>();

            int LogCount = 1;
            try
            {
                LogCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                LogCount = 1;
            }
            Count = LogCount;

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    try
                    {
                        Dictionary<int, string> Dic = new _AdminUser().GetAdminUserDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            adminLogInfo l = new adminLogInfo 
                            { 
                                AddOn = Convert.ToDateTime(r["addOn"]), 
                                Content = r["content"].ToString(),
                                AdminID = Convert.ToInt16(r["AdminID"]),
                                StreamNo = r["StreamNo"].ToString(),
                                LogType = Convert.ToInt16(r["LogType"]), 
                                AdminName = "",
                                LogTypeName = ""
                            };
                            if (Dic.ContainsKey(l.AdminID))
                            {
                                l.AdminName = Dic[l.AdminID].ToString();
                            }
                            switch (l.LogType)
                            {
                                case 0:
                                    l.LogTypeName = "系统日志";
                                    break;
                                case 1:
                                    l.LogTypeName = "发送日志";
                                    break;
                                case 2:
                                    l.LogTypeName = "操作日志";
                                    break;
                                case 3:
                                    l.LogTypeName = "登陆日志";
                                    break;
                            }
                            ls.Add(l);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return ls;
        }
    }
}
