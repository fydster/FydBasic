using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Model;
using Rtdl.Sms.Data;

namespace Rtdl.Basic.Data
{
    public class _AdminUser:DbCenter
    {
        /// <summary>
        /// 检查用户信息是否正确并返回
        /// </summary>
        /// <param name="mobile"></param>
        /// <param name="pass"></param>
        /// <returns></returns>
        public adminUser checkUser(string LoginName, string LoginPass)
        {
            adminUser admin = null;
            string sql = "select * from tbl_admin_User where LoginName = '" + LoginName + "' and LoginPass = '" + LoginPass + "' and enable = 0";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, smsChannelSetting> Dic = new _SmsChannelSetting().GetSmsChannelSettingDic();
                        DataRow r = dt.Rows[0];
                        admin = new adminUser
                        {
                            ID = Convert.ToInt16(r["id"]),
                            CorpName = r["CorpName"].ToString(),
                            LoginName = r["LoginName"].ToString(),
                            Limits = r["limits"].ToString(),
                            RoleID = Convert.ToInt16(r["RoleID"]),
                            Mobile = r["mobile"].ToString(),
                            Memo = r["memo"].ToString(),
                            Contact = r["Contact"].ToString(),
                            Enable = Convert.ToInt16(r["enable"]),
                            Account = Convert.ToInt32(r["Account"]),
                            AddOn = Convert.ToDateTime(r["addOn"])
                        };
                        if (admin.RoleID > 0)
                        {
                            admin.Limits = new _AdminRole().GetLimits(admin.RoleID);
                        }
                        if (Dic.ContainsKey(admin.ID))
                        {
                            admin.Account = Dic[admin.ID].MaxNum;
                        }
                    }
                }
            }
            catch
            {
            }
            return admin;
        }

        public string UpdatePass(string uName, string oldPass, string newPass)
        {
            string upPass = "修改失败";
            oldPass = com.seascape.tools.BasicTool.MD5(oldPass);
            newPass = com.seascape.tools.BasicTool.MD5(newPass);
            if (checkUser(uName, oldPass) != null)
            {
                var o = new
                {
                    LoginPass = newPass
                };
                if (new Main().UpdateDb(o, "tbl_admin_User", "LoginName = '" + uName + "'"))
                {
                    upPass = "OK";
                }
            }
            else
            {
                upPass = "原始密码错误";
            }
            return upPass;
        }

        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<adminInfo> GetAdminUserList(string sql)
        {
            List<adminInfo> le = null;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<adminInfo>();
                    Dictionary<int, smsChannelSetting> Dic = new _SmsChannelSetting().GetSmsChannelSettingDic();
                    Dictionary<int, smsChannel> DicC = new _SmsChannel().GetSmsChannelDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        adminInfo e = new adminInfo
                        {
                            ID = Convert.ToInt16(r["id"]),
                            CorpName = r["CorpName"].ToString(),
                            LoginName = r["LoginName"].ToString(),
                            Limits = r["limits"].ToString(),
                            RoleID = Convert.ToInt16(r["RoleID"]),
                            Mobile = r["mobile"].ToString(),
                            Memo = r["memo"].ToString(),
                            Contact = r["Contact"].ToString(),
                            Enable = Convert.ToInt16(r["enable"]),
                            Account = Convert.ToInt32(r["Account"]),
                            AddOn = Convert.ToDateTime(r["addOn"])
                        };
                        if (Dic.ContainsKey(e.ID))
                        {
                            e.channelSet = Dic[e.ID];
                            if (DicC.ContainsKey(e.channelSet.ChannelID))
                            {
                                e.channel = DicC[e.channelSet.ChannelID];
                            }
                        }
                        le.Add(e);
                    }
                }
            }
            return le;
        }


        /// <summary>
        /// 账户详情
        /// </summary>
        /// <param name="mobile"></param>
        /// <param name="pass"></param>
        /// <returns></returns>
        public adminInfo adminInfo(int ID)
        {
            adminInfo admin = null;
            string sql = "select * from tbl_admin_User where id = " + ID;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, smsChannelSetting> Dic = new _SmsChannelSetting().GetSmsChannelSettingDic();
                        Dictionary<int, smsChannel> DicC = new _SmsChannel().GetSmsChannelDic();
                        DataRow r = dt.Rows[0];
                        admin = new adminInfo
                        {
                            ID = Convert.ToInt16(r["id"]),
                            CorpName = r["CorpName"].ToString(),
                            LoginName = r["LoginName"].ToString(),
                            Limits = r["limits"].ToString(),
                            RoleID = Convert.ToInt16(r["RoleID"]),
                            Mobile = r["mobile"].ToString(),
                            Memo = r["memo"].ToString(),
                            Contact = r["Contact"].ToString(),
                            Enable = Convert.ToInt16(r["enable"]),
                            Account = Convert.ToInt32(r["Account"]),
                            AddOn = Convert.ToDateTime(r["addOn"])
                        };
                        if (Dic.ContainsKey(admin.ID))
                        {
                            admin.channelSet = Dic[admin.ID];
                            if (DicC.ContainsKey(admin.channelSet.ChannelID))
                            {
                                admin.channel = DicC[admin.channelSet.ChannelID];
                            }
                        }

                    }
                }
            }
            catch
            {
            }
            return admin;
        }

        /// <summary>
        /// 获取字典
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public Dictionary<int, string> GetAdminUserDic()
        {
            Dictionary<int, string> dic = new Dictionary<int, string>();
            using (DataTable dt = helper.GetDataTable("select * from tbl_admin_User"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        dic.Add(Convert.ToInt16(r["id"]), r["CorpName"].ToString());
                    }
                }
            }
            return dic;
        }

        public int CheckUser(string uName)
        {
            int hid = 0;
            string sql = "select * from tbl_admin_user where LoginName = '" + uName + "' and enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    hid = Convert.ToInt16(dt.Rows[0]["Id"]);
                }
            }
            return hid;
        }
    }
}
