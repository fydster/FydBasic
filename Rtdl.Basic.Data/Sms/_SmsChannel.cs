using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Data;

namespace Rtdl.Sms.Data
{
    public class _SmsChannel:DbCenter
    {
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<smsChannel> GetSmsChannelList(string sql)
        {
            List<smsChannel> le = null;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<smsChannel>();
                    foreach (DataRow r in dt.Rows)
                    {
                        smsChannel e = new smsChannel
                        {
                            ID = Convert.ToInt32(r["id"]),
                            ChannelName = r["ChannelName"].ToString(),
                            MchUName = r["MchUName"].ToString(),
                            MchUPass = r["MchUPass"].ToString(),
                            ChannelID = Convert.ToInt16(r["ChannelID"]),
                            Enable = Convert.ToInt16(r["enable"]),
                            MoPort = Convert.ToInt16(r["MoPort"]),
                            MtPort = Convert.ToInt16(r["MtPort"]),
                            MchIP = r["MchIP"].ToString(),
                            MchBalance = Convert.ToInt32(r["MchBalance"]),
                            AddOn = Convert.ToDateTime(r["addOn"]),
                            GetBalanceOn = Convert.ToDateTime(r["GetBalanceOn"])
                        };
                        le.Add(e);
                    }
                }
            }
            return le;
        }

        /// <summary>
        /// 获取字典
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public Dictionary<int, smsChannel> GetSmsChannelDic()
        {
            Dictionary<int, smsChannel> dic = new Dictionary<int, smsChannel>();
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from tbl_channel"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            smsChannel e = new smsChannel
                            {
                                ID = Convert.ToInt16(r["id"]),
                                ChannelName = r["ChannelName"].ToString(),
                                MchUName = r["MchUName"].ToString(),
                                MchUPass = r["MchUPass"].ToString(),
                                ChannelID = Convert.ToInt16(r["ChannelID"]),
                                Enable = Convert.ToInt16(r["enable"]),
                                MchBalance = Convert.ToInt32(r["MchBalance"]),
                                MoPort = Convert.ToInt16(r["MoPort"]),
                                MtPort = Convert.ToInt16(r["MtPort"]),
                                MchIP = r["MchIP"].ToString(),
                                AddOn = Convert.ToDateTime(r["addOn"]),
                                GetBalanceOn = Convert.ToDateTime(r["GetBalanceOn"]),
                                ChannelType = Convert.ToInt16(r["ChannelType"])
                            };
                            if (!dic.ContainsKey(e.ChannelID))
                            {
                                dic.Add(Convert.ToInt16(r["ChannelID"]), e);
                            }
                        }
                    }
                }
            }
            catch
            {

            }
            
            return dic;
        }

    }
}
