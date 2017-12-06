using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Data;

namespace Rtdl.Sms.Data
{
    public class _SmsStream:DbCenter
    {
        public List<smsStream> GetSmsList(string sql, string sql_c, out int Count)
        {
            List<smsStream> ls = new List<smsStream>();

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
                    Dictionary<int, string> Dic = new _Class().GetClassDic();
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            smsStream l = new smsStream
                            {
                                AddOn = Convert.ToDateTime(r["addOn"]),
                                Content = r["content"].ToString(),
                                AdminID = Convert.ToInt16(r["AdminID"]),
                                StreamNo = r["StreamNo"].ToString(),
                                Mobiles = r["Mobiles"].ToString(),
                                SendName = r["SendName"].ToString(),
                                MobileNum = Convert.ToInt32(r["MobileNum"]),
                                SendType = Convert.ToInt16(r["SendType"]),
                                FeeNum = Convert.ToInt32(r["FeeNum"]),
                                State = Convert.ToInt16(r["State"])
                            };
                            if (l.SendType == 1)
                            {
                                string[] Arr = l.Mobiles.Split(',');
                                foreach (string item in Arr)
                                {
                                    if (item.Length > 0)
                                    {
                                        if (Dic.ContainsKey(Convert.ToInt16(item)))
                                        {
                                            l.SendName += Dic[Convert.ToInt16(item)] + ",";
                                        }
                                    }
                                }
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


        public List<smsStream> GetSmsList(int State)
        {
            List<smsStream> ls = new List<smsStream>();
            string sql = "select * from tbl_sms where State = " + State + " order by FeeNum asc, id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        try
                        {
                            foreach (DataRow r in dt.Rows)
                            {
                                smsStream l = new smsStream
                                {
                                    AddOn = Convert.ToDateTime(r["addOn"]),
                                    Content = r["content"].ToString(),
                                    AdminID = Convert.ToInt16(r["AdminID"]),
                                    ChannelID = Convert.ToInt16(r["ChannelID"]),
                                    StreamNo = r["StreamNo"].ToString(),
                                    Mobiles = r["Mobiles"].ToString(),
                                    SendName = r["SendName"].ToString(),
                                    State = Convert.ToInt16(r["State"])
                                };
                                ls.Add(l);
                            }
                        }
                        catch (Exception ex)
                        {

                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
            
            return ls;
        }
    }
}
