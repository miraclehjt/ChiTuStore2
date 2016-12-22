import * as services from 'services';
import { Page } from 'chitu.mobile';
import { config as imageBoxConfig } from 'controls/imageBox';
import * as chitu from 'chitu';

imageBoxConfig.imageDisaplyText = '零食有约';

export let config = {
    imageText: imageBoxConfig.imageDisaplyText,
    defaultUrl: 'home_index'
}

let DEFAULT_HEADER_HTML = `
<nav class="bg-primary" style="width:100%;">
    <h4>&nbsp;</h4>
</nav>`;

let DEFAULT_HEADER_WITH_BACK_HTML = `
<nav class="bg-primary" style="width:100%;">
    <a name="back-button" href="javascript:app.back()" class="leftButton" style="padding-right:20px;padding-left:20px;margin-left:-20px;">
        <i class="icon-chevron-left"></i>
    </a>
    <h4>&nbsp;</h4>
</nav>`;

let LOADING_HTML = `
<div class="spin">
    <i class="icon-spinner icon-spin"></i>
</div>`;


class MyApplication extends chitu.Application {
    private _cachePages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];
    private topLevelPages: Array<string>;

    constructor() {
        super();
        this.pageType = Page;
        this.topLevelPages = this._cachePages;
    }

    protected parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as Page;

        page.loadingView.innerHTML = LOADING_HTML;

        let headerElement = page.createHeader(50);

        if (this.topLevelPages.indexOf(routeData.pageName) >= 0) {
            headerElement.innerHTML = DEFAULT_HEADER_HTML;
            requirejs([`text!ui/menu.html`], function (footerHTML) {
                let footerElement = page.createFooter(50);
                footerElement.innerHTML = footerHTML;
                var activeElement = footerElement.querySelector(`[name="${routeData.pageName}"]`) as HTMLElement;
                if (activeElement) {
                    activeElement.className = 'active';
                }
            })
        }
        else {
            headerElement.innerHTML = DEFAULT_HEADER_WITH_BACK_HTML;
        }

        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!content/app` + path;
        requirejs([cssPath]);

        let className = routeData.pageName.split('.').join('-');
        page.element.className = 'page ' + className;
        page.allowCache = this._cachePages.indexOf(page.name) >= 0;
        return page;
    }


}

export let app = window['app'] = new MyApplication();
app.run();
app.backFail.add(() => {
    app.redirect(config.defaultUrl);
});

if (!location.hash) {
    app.redirect(config.defaultUrl);
}

//================================================================================

export function createDefaultHeader(h, title: string) {

}