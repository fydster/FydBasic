using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Sms.Model
{
    public class smsChannelSetting
    {
        public int ID { get; set; }
        public int AdminID { get; set; }
        public int SendType { get; set; }
        public int ChannelID { get; set; }
        public int SignType { get; set; }
        public int BakChannelID { get; set; }
        public string SignName { get; set; }
        public int MaxNum { get; set; }
        public int Grade { get; set; }
        public DateTime AddOn { get; set; }
        public int LNum { get; set; }
    }
}
