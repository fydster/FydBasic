using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Data;

namespace Rtdl.Sms.Data
{
    public class _SmsChannelSetting:DbCenter
    {
        /// <summary>
        /// 获取字典
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public Dictionary<int, smsChannelSetting> GetSmsChannelSettingDic()
        {
            Dictionary<int, smsChannelSetting> dic = new Dictionary<int, smsChannelSetting>();
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from tbl_channel_setting"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            smsChannelSetting e = new smsChannelSetting
                            {
                                ID = Convert.ToInt16(r["id"]),
                                ChannelID = Convert.ToInt16(r["ChannelID"]),
                                SignType = Convert.ToInt16(r["SignType"]),
                                AdminID = Convert.ToInt16(r["AdminID"]),
                                SendType = Convert.ToInt16(r["SendType"]),
                                MaxNum = Convert.ToInt32(r["MaxNum"]),
                                BakChannelID = Convert.ToInt16(r["BakChannelID"]),
                                LNum = Convert.ToInt16(r["LNum"]),
                                SignName = r["SignName"].ToString(),
                                Grade = Convert.ToInt16(r["Grade"]),
                                AddOn = Convert.ToDateTime(r["addOn"])
                            };
                            if (!dic.ContainsKey(e.AdminID))
                            {
                                dic.Add(e.AdminID, e);
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

        public List<smsChannelSetting> GetSmsChannelSettingList()
        {
            List<smsChannelSetting> ls = new List<smsChannelSetting>();
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from tbl_channel_setting"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            smsChannelSetting e = new smsChannelSetting
                            {
                                ID = Convert.ToInt16(r["id"]),
                                ChannelID = Convert.ToInt16(r["ChannelID"]),
                                SignType = Convert.ToInt16(r["SignType"]),
                                AdminID = Convert.ToInt16(r["AdminID"]),
                                SendType = Convert.ToInt16(r["SendType"]),
                                MaxNum = Convert.ToInt32(r["MaxNum"]),
                                BakChannelID = Convert.ToInt16(r["BakChannelID"]),
                                LNum = Convert.ToInt16(r["LNum"]),
                                SignName = r["SignName"].ToString(),
                                Grade = Convert.ToInt16(r["Grade"]),
                                AddOn = Convert.ToDateTime(r["addOn"])
                            };
                            ls.Add(e);
                        }
                    }
                }
            }
            catch
            {

            }

            return ls;
        }
    }
}
