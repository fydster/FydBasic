using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Model;
using Rtdl.Basic.Data;

namespace Rtdl.Sms.Data
{
    public class _SmsMo:DbCenter
    {
        public List<smsMoInfo> GetSmsList(string sql, string sql_c, out int Count)
        {
            List<smsMoInfo> ls = new List<smsMoInfo>();

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
                    Dictionary<int, string> Dic = new _AdminUser().GetAdminUserDic();
                    Dictionary<int, smsChannel> Dic_C = new _SmsChannel().GetSmsChannelDic();
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            smsMoInfo l = new smsMoInfo
                            {
                                AddOn = Convert.ToDateTime(r["addOn"]),
                                Content = r["content"].ToString(),
                                AdminID = Convert.ToInt16(r["AdminID"]),
                                AdminName = "",
                                Mobile = r["Mobile"].ToString(),
                                ChannelID = Convert.ToInt16(r["ChannelID"]),
                                ChannelName = ""
                            };
                            if (Dic.ContainsKey(l.AdminID))
                            {
                                l.AdminName = Dic[l.AdminID];
                            }
                            if (Dic_C.ContainsKey(l.ChannelID))
                            {
                                l.ChannelName = Dic_C[l.ChannelID].ChannelName;
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
