using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Basic.Model
{
    public class smsMoInfo
    {
        public int ID { get; set; }
        public int AdminID { get; set; }
        public int ChannelID { get; set; }
        public string Mobile { get; set; }
        public string Content { get; set; }
        public DateTime AddOn { get; set; }
        public string AdminName { get; set; }
        public string ChannelName { get; set; }
    }
}
