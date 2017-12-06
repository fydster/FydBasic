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
    public class SmsSend:DbCenter
    {
        public int ToSend()
        {
            int allNum = 0;
            try
            {
                Dictionary<int, smsChannel> Dic = Program.Dic;
                List<smsStream> ls = new _SmsStream().GetSmsList(1);
                if (ls.Count > 0)
                {
                    //通道相关信息
                    string MchIP = "";
                    string MchUName = "";
                    string MchUPass = "";
                    int channelType = 0;
                    int MtPort = 0;
                    int MoPort = 0;

                    string StreamNo = "";
                    foreach (smsStream item in ls)
                    {
                        MchUName = "";
                        MchUPass = "";
                        MchIP = "";
                        MoPort = 0;
                        StreamNo = item.StreamNo;
                        string outS = "";
                        List<smsMx> lMx = new _SmsMx().GetSmsMxList(StreamNo, 0,out outS);
                        List<string> lsql = new List<string>();
                        if (Dic.ContainsKey(item.ChannelID))
                        {
                            MchUName = Dic[item.ChannelID].MchUName;
                            MchUPass = Dic[item.ChannelID].MchUPass;
                            channelType = Dic[item.ChannelID].ChannelType;
                            MtPort = Dic[item.ChannelID].MtPort;
                            MoPort = Dic[item.ChannelID].MoPort;
                            MchIP = Dic[item.ChannelID].MchIP;
                        }
                        int Result = 1;
                        string ErrMsg = "";
                        Program.SignLog("待发送（--" + StreamNo + "-" + outS + "-" + lMx.Count + "）条记录", true);
                        foreach (smsMx mx in lMx)
                        {
                            try
                            {
                                if (channelType == 0)
                                {
                                    Result = XwSmsApi.PostMsg(MchUName, MchUPass, MchIP, MoPort, MtPort, mx.Mobile, mx.Content,mx.customMsgID,out ErrMsg);
                                }
                                else
                                {
                                    //深圳会员
                                    SzSmsApi sz = new SzSmsApi
                                    {
                                        enterpriseID = MchIP,
                                        loginName = MchUName,
                                        password = MchUPass,
                                        content = mx.Content,
                                        mobiles = mx.Mobile,
                                        smsId = mx.customMsgID
                                    };
                                    Result = SzSmsApi.SendSms(sz);
                                }

                                if (Result == 0)
                                {
                                    Result = 1;
                                }
                            }
                            catch(Exception e)
                            {
                                Result = 2;
                                ErrMsg = e.Message.ToString();
                            }
                            allNum++;
                            helper.ExecuteSqlNoResult("update tbl_sms_mx set State = " + Result + ",SendOn = '" + DateTime.Now + "',ErrMsg = '" + ErrMsg + "' where ID = " + mx.ID);
                        }
                        var o = new
                        {
                            State = 2
                        };
                        new Main().UpdateDb(o, "tbl_sms", "StreamNo = '" + StreamNo + "'");
                    }
                    //Program.SignLog("共发送（" + allNum + "）条记录", true);
                }
            }
            catch
            {

            }
            return allNum;
        }
    }
}
