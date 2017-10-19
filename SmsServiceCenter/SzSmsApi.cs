using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using com.seascape.tools;
using System.Xml;
using System.Net;
using System.IO;

namespace SmsServiceCenter
{
    public class SzSmsApi
    {
        public string enterpriseID { get; set; }
        public string loginName { get; set; }
        public string password { get; set; }
        public string smsId { get; set; }
        public string subPort { get; set; }
        public string content { get; set; }
        public string mobiles { get; set; }
        public string sendTime { get; set; }

        public static int SendSms(SzSmsApi s)
        {
            int result = 2;
            string PostUrl = "http://113.108.68.228:8001/sendSMS.action";
            string para = "";
            para += "enterpriseID=" + s.enterpriseID;
            para += "&loginName=" + s.loginName;
            para += "&password=" + s.password;
            para += "&smsId=" + s.smsId;
            para += "&subPort=" + s.subPort;
            para += "&content=" + get_uft8(s.content);
            para += "&mobiles=" + s.mobiles;
            para += "&sendTime=" + s.sendTime;
            
            try
            {
                string xmlResult = OpenReadWithHttps(PostUrl, para, "UTF-8");
                if (xmlResult.IndexOf("<Result>0</Result>") > -1)
                {
                    result = 1;
                }
            }
            catch(Exception e)
            {
                result = 2;
            }

            return result;
        }

        public static string OpenReadWithHttps(string URL, string strPostdata, string strEncoding)
        {
            try
            {
                Encoding encoding = Encoding.UTF8;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
                request.Method = "post";
                request.Accept = "text/html, application/xhtml+xml, */*";
                request.ContentType = "application/x-www-form-urlencoded;charset=UTF-8";
                byte[] buffer = encoding.GetBytes(strPostdata);
                request.ContentLength = buffer.Length;
                request.GetRequestStream().Write(buffer, 0, buffer.Length);
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                using (StreamReader reader = new StreamReader(response.GetResponseStream(), System.Text.Encoding.GetEncoding(strEncoding)))
                {
                    return reader.ReadToEnd();
                }
            }
            catch(Exception e)
            {
                return "";
            }
        }

        public static string get_uft8(string unicodeString)
        {
            UTF8Encoding utf8 = new UTF8Encoding();
            Byte[] encodedBytes = utf8.GetBytes(unicodeString);
            String decodedString = utf8.GetString(encodedBytes);
            return decodedString;
        }
    }
}
