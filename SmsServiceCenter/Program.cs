using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using log4net;
using Rtdl.Sms.Model;
using Rtdl.Sms.Data;
using System.Threading;
using com.seascape.tools;

namespace SmsServiceCenter
{
    public class Program
    {
        public static Dictionary<int, smsChannel> Dic;
        public static Dictionary<int, smsChannelSetting> DicSet;
        static void Main(string[] args)
        {
            LogHelper.IsWrite(true);

            try
            {
                Dic = new _SmsChannel().GetSmsChannelDic();
                DicSet = new _SmsChannelSetting().GetSmsChannelSettingDic();
            }
            catch(Exception e)
            {
                SignLog("初始化配置信息出错" + e.Message, true);
            }

            //分发线程启动
            ThreadStart SmsSplit = new ThreadStart(Program.SmsSplit);
            Thread SmsSplit_s = new Thread(SmsSplit);
            SmsSplit_s.Start();

            //获取余额线程启动
            ThreadStart GetA = new ThreadStart(Program.GetAccount);
            Thread GetA_s = new Thread(GetA);
            //GetA_s.Start();

            //测试短信线程启动
            ThreadStart GetS = new ThreadStart(Program.TestSendSms);
            Thread GetS_s = new Thread(TestSendSms);
            //GetS_s.Start();

            //发送短信线程启动
            ThreadStart GetSend = new ThreadStart(Program.SmsSend);
            Thread GetSend_s = new Thread(GetSend);
            GetSend_s.Start();

            //接收短信线程启动
            ThreadStart GetMo = new ThreadStart(Program.GetMo);
            Thread GetMo_s = new Thread(GetMo);
            GetMo_s.Start();

            //更新配置
            ThreadStart GetConfig = new ThreadStart(Program.InitConfig);
            Thread GetC_s = new Thread(GetConfig);
            GetC_s.Start();
        }

        /// <summary>
        /// 获取配置信息
        /// </summary>
        private static void InitConfig()
        {
            SignLog("更新配置信息", false);
            while (true)
            {
                try
                {
                    Dic = new _SmsChannel().GetSmsChannelDic();
                    DicSet = new _SmsChannelSetting().GetSmsChannelSettingDic();
                    SignLog("更新配置完成", false);
                }
                catch(Exception e)
                {
                    SignLog("初始化配置信息出错" + e.Message, true);
                }
                
                Thread.Sleep(1000 * 60 * 10);
            }
        }

        /// <summary>
        /// 获取余额
        /// </summary>
        private static void GetAccount()
        {
            SignLog("余额获取线程启动", true);
            while (true)
            {
                //XwSmsApi.GetAccountInfo("sxgy@bjsxhj2", "hj@08555");
                Thread.Sleep(1000 * 60 * 60 * 24);
            }
        }

        /// <summary>
        /// 测试短信
        /// </summary>
        private static void TestSendSms()
        {
            SignLog("发送短信线程启动", true);
            while (true)
            {
                string ErrMsg = "";
                int test = 0;// XwSmsApi.PostMsg("sxgy@bjsxhj2", "hj@08555", "13100000138", "我院订于2017年6月10日召开全员大会【山西高院】", out ErrMsg);
                //int test = XwSmsApi.PostMsg("bjjcb@bjjcb", "haijing08555", "13100000138", "我院订于2017年6月10日召开全员大会", out ErrMsg);
                //SignLog("发送结果" + test, true);
                //SignLog("发送结果文本" + ErrMsg, true);
                
                SzSmsApi s = new SzSmsApi
                {
                    enterpriseID = "11343",
                    loginName = "admin",
                    password = "a1b6503429eb8e4f4589c7f754db83a3",
                    content = "2017-08-20,通知，原定周日召开的员工大会推迟到下周一，望周知【软通信息】",
                    mobiles = "13100000138",
                    smsId = DateTime.Now.ToString("yyMMddHHmmss"),
                    subPort = "",
                    sendTime = ""
                };
                test = SzSmsApi.SendSms(s);
                SignLog("发送结果--" + test, true);
                SignLog("发送结果文本--" + ErrMsg, true);
                
                Thread.Sleep(1000 * 60 * 60 * 24);
            }
        }


        /// <summary>
        /// 分发
        /// </summary>
        private static void SmsSplit()
        {
            SignLog("分发线程启动", false);
            int logNum = 0;
            while (true)
            {
                int allNum = new SmsCenter().SmsSplit();
                if (allNum > 0 || logNum == 30)
                {
                    SignLog("分发" + allNum, true);
                    logNum = 0;
                }
                else
                {
                    logNum++;
                }
                Thread.Sleep(2000);
            }
        }

        /// <summary>
        /// 发送短信
        /// </summary>
        private static void SmsSend()
        {
            SignLog("发送线程启动", false);
            int logNum = 0;
            while (true)
            {
                int allNum = new SmsSend().ToSend();
                if (allNum > 0 || logNum == 30)
                {
                    SignLog("------------发送" + allNum, true);
                    logNum = 0;
                }
                else
                {
                    logNum++;
                }
                
                Thread.Sleep(2000);
            }
        }


        /// <summary>
        /// 获取上行信息
        /// </summary>
        private static void GetMo()
        {
            SignLog("上行获取线程启动", true);
            while (true)
            {
                int moNum = 0;
                try
                {
                    smsChannel sc = null;
                    foreach (var item in DicSet)
                    {
                        if (Dic.ContainsKey(item.Value.ChannelID))
                        {
                            sc = Dic[item.Value.ChannelID];
                        }
                        if (sc != null)
                        {
                            moNum += new XwSmsApi().GetMo(sc.MchUName, sc.MchUPass, sc.MchIP, sc.MoPort, item.Value.AdminID, item.Value.ChannelID);
                        }
                    }
                }
                catch(Exception e)
                {
                    SignLog("上行获取线程异常：" + e.Message, true);
                }
                SignLog("------上行" + moNum, true);
                Thread.Sleep(1000 * 60);
            }
        }

        /// <summary>
        /// 日志处理
        /// </summary>
        /// <param name="Content"></param>
        /// <param name="cType"></param>
        public static void SignLog(string Content, bool cType)
        {
            try
            {
                Console.WriteLine("[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "]" + Content);
                if (cType)
                {
                    LogHelper.WriteLog(Content);
                }
            }
            catch(Exception e)
            {
                Console.WriteLine("写日志失败：" + e.Message);
            }
            
        }
    }
}
