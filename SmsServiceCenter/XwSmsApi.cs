using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PostMsg_Net.common;
using PostMsg_Net;
using Rtdl.Basic.Data;


namespace SmsServiceCenter
{
    public class XwSmsApi:DbCenter
    {
        static PostMsg_Net.PostMsg postMsg = new PostMsg_Net.PostMsg();

        //static int proxyType = ProxyServer.PROXY_TYPE_DIRECT;	//缺省为HTTP代理
        static ProxyServer proxy = new ProxyServer();


        /// <summary>
        /// 获取账户信息
        /// </summary>
        public static void GetAccountInfo(string MchUName, string MchUPass, string MchIP, int MoPort, int MtPort)
        {
            try
            {
                postMsg.SetUser(MchUName, MchUPass);
                postMsg.SetMOAddress(MchIP, MoPort, LinkType.SHORTLINK);         /// 设置上行网关地址、端口
                postMsg.SetGateWay(MchIP, MtPort, LinkType.SHORTLINK);           /// 设置下行网关地址、端口
                                                                                          /// 
                AccountInfo accountinfo = postMsg.GetAccountInfo(new Account()
                {
                    Name = MchUName,
                    Password = MchUPass
                });

                if (accountinfo == null)
                    Console.WriteLine("null");
                else
                {
                    Program.SignLog(accountinfo.name + "（" + accountinfo.balance + "）条", true);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("出现异常：" + ex.Message);
            }
        }


        public static int PostMsg(string MchUName, string MchUPass,string MchIP, int MoPort, int MtPort, string mobile, string content, string customMsgID,out string msg)
        {
            int result = -1;
            string errMsg = "";
            postMsg.SetUser(MchUName, MchUPass);
            postMsg.SetMOAddress(MchIP, MoPort, LinkType.SHORTLINK);         /// 设置上行网关地址、端口
            postMsg.SetGateWay(MchIP, MtPort, LinkType.SHORTLINK);           /// 设置下行网关地址、端口

            //普通端口，http端口 9050 18088
            //postMsg.SetMOAddress("211.147.239.62",9070, LinkType.SHORTLINK);         /// 设置上行网关地址、端口
            //postMsg.SetGateWay("211.147.239.62",9080, LinkType.SHORTLINK);           /// 设置下行网关地址、端口
              
            //400端口                                                            
            //postMsg.SetMOAddress("211.147.239.62", 8460, LinkType.SHORTLINK);         /// 设置上行网关地址、端口
            //postMsg.SetGateWay("211.147.239.62", 8450, LinkType.SHORTLINK);           /// 设置下行网关地址、端口

            MessageData[] messagedatas = new MessageData[1];   // 号码数量

            #region 群发
            ///////////////////////<<群发>>/////////////////
            for (int i = 0; i < messagedatas.Length; i++)
            {
                messagedatas[i] = new MessageData();
                messagedatas[i].Content = content;
                messagedatas[i].Phone = mobile;
                messagedatas[i].vipFlag = true;
                messagedatas[i].customMsgID = customMsgID;
                messagedatas[i].customNum = "";
            }
            #endregion

            #region 组发
            ///////////////////////<<组发>>/////////////////
            //for (int i = 0; i < messagedatas.Length; i++)
            //{
            //    messagedatas[i] = new MessageData();
            //    messagedatas[i].Content = "内容" + i;
            //    messagedatas[i].Phone = "135" + i.ToString("D8");
            //    messagedatas[i].vipFlag = true;
            //    messagedatas[i].customMsgID = "3241111";
            //}
            #endregion

            #region
            ///////////////<<手动>>///////////////////
            //messagedatas[0] = new MessageData();
            //messagedatas[0].Content = "34";
            //messagedatas[0].Phone = "";
            //messagedatas[0].vipFlag = true;
            //messagedatas[0].customMsgID = "121";

            //messagedatas[1] = new MessageData();
            //messagedatas[1].Content = "rw";
            //messagedatas[1].Phone = "13580550705";
            //messagedatas[1].vipFlag = true;
            //messagedatas[1].customMsgID = "121";
            #endregion

            MTPack mtpack = new MTPack();
            mtpack.batchID = Guid.NewGuid();
            mtpack.batchName = "Rtxx"+DateTime.Now.ToString("yyyyMMdd");  /// 分批名称
            mtpack.msgs = messagedatas;
            mtpack.msgType = 1;
            mtpack.bizType = 1;
            mtpack.customNum = "";                          /// 扩展号
            mtpack.scheduleTime = 0;                             /// 时间使用int64类型，是指从1970-1-1 00:00:00开始到当前的毫秒数
            mtpack.sendType = 0;                                 /// 发送类型  0为群发   1为组发    
            mtpack.distinctFlag = true;                          /// 是否过滤重复号码
            mtpack.deadline = 0;                                 /// 时间使用int64类型，是指从1970-1-1 00:00:00开始到当前的毫秒数
            mtpack.remark = "";                            /// 备注                               

            GsmsResponse gr = postMsg.Post(new Account()
            {
                Name = MchUName,
                Password = MchUPass
            }, mtpack);

            if (gr != null)
            {
                //Console.WriteLine("发送批次号:" + gr.uuid.ToString() + "\r\n");
                result = gr.result;
                errMsg = gr.message.ToString();
                //Console.WriteLine("结果信息：" + gr.attributes.ToString() + "\r\n");
                if (result != 0)
                {
                    Console.WriteLine("发送失败：" + errMsg + "\r\n");
                }
            }
            msg = errMsg;
            return result;
        }

        /// <summary>
        /// 获取上行信息
        /// </summary>
        /// <param name="MchUName"></param>
        /// <param name="MchUPass"></param>
        /// <param name="MchIP"></param>
        /// <param name="MoPort"></param>
        /// <returns></returns>
        public int GetMo(string MchUName, string MchUPass, string MchIP, int MoPort,int AdminID,int ChannelID)
        {
            int result = 0;
            postMsg.SetUser(MchUName, MchUPass);
            postMsg.SetMOAddress(MchIP, MoPort, LinkType.SHORTLINK); 
            try
            {
                MOMsg[] getMos = null;
                getMos = postMsg.GetMOMessage(new PostMsg_Net.Account()
                {
                    Name = MchUName,
                    Password = MchUPass
                });

                string mobile = "";
                string content = "";
                DateTime addOn = DateTime.Now;
                if (getMos != null)
                {
                    List<string> ls = new List<string>();
                    for (int i = 0; i < getMos.Length; i++)
                    {
                        mobile = getMos[i].phone;
                        content = getMos[i].content;
                        addOn = getMos[i].receiveTime;
                        ls.Add("insert into tbl_sms_mo(AdminID,ChannelID,Mobile,Content,AddOn) values(" + AdminID + "," + ChannelID + ",'" + mobile + "','" + content + "','" + DateTime.Now + "')");
                    }
                    if (ls.Count > 0)
                    {
                        result += ls.Count;
                        helper.ExecuteTransaction(ls);
                    }
                }
                else
                {
                   
                }
            }
            catch (Exception ex)
            {
                
            }
            return result;
        }

        public static int GetMtReport(string MchUName, string MchUPass, string MchIP, int MoPort)
        {
            int result = 0;
            postMsg.SetUser(MchUName, MchUPass);
            postMsg.SetMOAddress(MchIP, MoPort, LinkType.SHORTLINK); 
            try
            {
                MTReport[] getMTReport;

                getMTReport = postMsg.GetReport(new PostMsg_Net.Account()
                {
                    Name = MchUName,
                    Password = MchUPass
                }, 1, 200);

                if (getMTReport == null)
                {
                    
                }
                else
                {
                    List<string> ls = new List<string>();
                    int state = -1;
                    string mobile = "";
                    string customMsgID = "";
                    for (int i = 0; i < getMTReport.Length; i++)
                    {
                        //------批次号:{0}\r\n手机号码:{1}\r\n状态:{2}\r\n提交时间:{3}\r\n完成时间:{4}\r\n消息ID:{5}\r\n用户自定义ID:{6}\r\n原始结果:{7}\r\n\r\n", getMTReport[i].batchID, getMTReport[i].phone, getMTReport[i].state, getMTReport[i].submitTime, getMTReport[i].doneTime, getMTReport[i].msgID, getMTReport[i].customMsgID, getMTReport[i].originResult
                        state = getMTReport[i].state;
                        mobile = getMTReport[i].phone;
                        customMsgID = getMTReport[i].customMsgID;
                        ls.Add("update tbl_sms_mx set ");
                    }
                }


            }
            catch (Exception ex)
            {
                
            }
            return result;
        }

    }
}
