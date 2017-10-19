using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using Rtdl.Basic.Model;
using System.Data;

namespace Rtdl.Basic.Data.PlugIn
{
    public class _ImportHisData:DbCenter
    {
        public void ImportData(string file,int AdminID)
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(file);

            XmlNode xn = doc.SelectSingleNode("Data");

            //分组
            string GroupName = "";
            int GroupID = 0;
            XmlNode xn_Gourp = xn.SelectSingleNode("Group");
            XmlNodeList xnl = xn_Gourp.ChildNodes;
            Dictionary<int, int> Dic_Group = new Dictionary<int, int>();
            foreach (XmlNode xn1 in xnl)
            {
                XmlElement xe = (XmlElement)xn1;
                GroupName = xe.InnerText;
                GroupID = Convert.ToInt16(xe.GetAttribute("id"));
                if (new _Class().CheckClass(GroupName, 0, AdminID) == 0)
                {
                    Class p = new Class
                    {
                        AdminID = AdminID,
                        ClassName = GroupName,
                        Leavel = 0,
                        PID = 0,
                        DescNum = 0
                    };
                    int NewGroupID = new Main().AddToDbForId(p, "tbl_service_class");
                    if (NewGroupID > 0)
                    {
                        Dic_Group.Add(GroupID, NewGroupID);
                    }
                }
            }

            //用户
            string Contact = "";
            string Mobile = "";
            int ClassID = 0;
            XmlNode xn_Person = xn.SelectSingleNode("Person");
            XmlNodeList xnp = xn_Person.ChildNodes;
            foreach (XmlNode xn1 in xnp)
            {
                XmlElement xe = (XmlElement)xn1;
                Contact = xe.InnerText;
                Mobile = xe.GetAttribute("mobile");
                ClassID = Convert.ToInt16(xe.GetAttribute("groupid"));
                if (Dic_Group.ContainsKey(ClassID))
                {
                    ClassID = Dic_Group[ClassID];
                    if (new _Address().CheckAddr(Mobile, ClassID, AdminID) == 0)
                    {
                        Address p = new Address
                        {
                            AdminID = AdminID,
                            Contact = Contact,
                            Mobile = Mobile,
                            ClassID = ClassID,
                            AddOn = DateTime.Now
                        };
                        new Main().AddToDb(p, "tbl_service_address");
                    }
                }
            }

        }
    }
}
