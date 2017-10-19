using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rtdl.Basic.Model;
using Rtdl.Basic.Data;
using Rtdl.Sms.Model;
using Rtdl.Sms.Data;
using System.Data;

namespace SmsServiceCenter
{
    public class SmsCenter:DbCenter
    {
        public int SmsSplit()
        {
            int allNum = 0;

            Dictionary<int, smsChannelSetting> Dic = Program.DicSet;
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from tbl_sms where State = 0 order by AddOn asc limit 0,10"))
                {
                    //Program.SignLog("[分发开始]共读取（" + dt.Rows.Count + "）条记录", true);
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        List<string> ls = new List<string>();
                        string StreamNo = "";
                        string Mobiles = "";
                        int ChannelID = 0;
                        int SignlType = 0;
                        string SignName = "";
                        int AdminID = 0;
                        int Grade = 0;
                        int SendType = 0;
                        int nowNum = 0;
                        string Content = "";
                        string customMsgID = "";
                        try
                        {
                            foreach (DataRow r in dt.Rows)
                            {
                                StreamNo = r["StreamNo"].ToString();
                                Mobiles = r["Mobiles"].ToString();
                                Content = r["Content"].ToString();
                                AdminID = Convert.ToInt16(r["AdminID"]);
                                SendType = Convert.ToInt16(r["SendType"]);
                                if (Dic.ContainsKey(AdminID))
                                {
                                    ChannelID = Dic[AdminID].ChannelID;
                                    Grade = Dic[AdminID].Grade;
                                    SignlType = Dic[AdminID].SignType;
                                    SignName = Dic[AdminID].SignName;
                                }

                                if (SignlType == 1 && SignName.Length > 0)
                                {
                                    Content = Content + SignName;
                                }

                                ls = new List<string>();

                                //手机号码发送
                                if (SendType == 0)
                                {
                                    nowNum = 0;
                                    foreach (string m in Mobiles.Split(','))
                                    {
                                        nowNum++;
                                        customMsgID = StreamNo + nowNum.ToString().PadLeft(5, '0');
                                        if (m.Length == 11)
                                        {
                                            ls.Add("insert into tbl_sms_mx(StreamNo,Mobile,Content,AddOn,customMsgID) values('" + StreamNo + "','" + m + "','" + Content + "','" + DateTime.Now + "','" + customMsgID + "')");
                                        }
                                    }
                                }

                                //通讯录发送
                                if (SendType == 1)
                                {
                                    nowNum = 0;
                                    Dictionary<string, int> Dic_M = new Dictionary<string, int>();
                                    List<Address> la = new _Address().GetGroupObjMx(Mobiles);
                                    string TempContent = "";
                                    foreach (Address item in la)
                                    {
                                        if (!Dic_M.ContainsKey(item.Mobile))
                                        {
                                            if (item.Mobile.Length == 11)
                                            {
                                                nowNum++;
                                                customMsgID = StreamNo + nowNum.ToString().PadLeft(5, '0');

                                                TempContent = Content.Replace("[$姓名$]", item.Contact);
                                                TempContent = TempContent.Replace("[$备注$]", item.Memo);
                                                ls.Add("insert into tbl_sms_mx(StreamNo,Mobile,Content,AddOn,customMsgID) values('" + StreamNo + "','" + item.Mobile + "','" + TempContent + "','" + DateTime.Now + "','" + customMsgID + "')");
                                            }
                                            Dic_M.Add(item.Mobile, 0);
                                        }
                                    }
                                }

                                if (ls.Count > 0)
                                {
                                    var o = new
                                    {
                                        State = 1,
                                        ChannelID = ChannelID
                                    };
                                    allNum += ls.Count;
                                    if (new Main().UpdateDb(o, "tbl_sms", "StreamNo = '" + StreamNo + "'"))
                                    {
                                        try
                                        {
                                            if (!new Main().ExecForSql(ls))
                                            {
                                                Program.SignLog("[分发入库失败]------请及时处理-----", true);
                                            }
                                        }
                                        catch
                                        {

                                        }

                                    }
                                }
                            }

                        }
                        catch
                        {

                        }
                    }
                    //Program.SignLog("[分发结束]共分发（" + allNum + "）条记录", true);
                }
            }
            catch(Exception e)
            {
                Program.SignLog("[分发出错]" + e.Message, true);
            }
            
            return allNum;
        }
    }
}
