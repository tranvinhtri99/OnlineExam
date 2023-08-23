using Ninject.Modules;
using OnlineExam.Common.Tokens;
using OnlineExam.Responsitories;
using OnlineExam.Services;

namespace OnlineExam.Mappings.NijectModules;

public class DefaultInjectModule : NinjectModule
{
    public override void Load()
    {
        #region Repositories

        Bind<AccountRepository>().ToSelf();


        #endregion
        
        #region Services

        Bind<AuthenticationService>().ToSelf();


        #endregion

        Bind<JwtManagement>().ToSelf();


    }
}