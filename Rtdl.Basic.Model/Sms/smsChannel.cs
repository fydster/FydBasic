using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Sms.Model
{
    public class smsChannel
    {
        public int ID { get; set; }
        public int ChannelID { get; set; }
        public string ChannelName { get; set; }
        public string MchUName { get; set; }
        public string MchUPass { get; set; }
        public string MchIP { get; set; }
        public int MtPort { get; set; }
        public int MoPort { get; set; }
        public int MchBalance { get; set; }
        public DateTime GetBalanceOn { get; set; }
        public int Enable { get; set; }
        public DateTime AddOn { get; set; }
        public int ChannelType { get; set; }
    }
}
