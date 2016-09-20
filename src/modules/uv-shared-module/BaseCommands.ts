class Commands {
    static namespace: string = 'uv.';

    static ACCEPT_TERMS: string                     = Commands.namespace + 'onAcceptTerms';
    static BOOKMARK: string                         = Commands.namespace + 'onBookmark';
    static CANVAS_INDEX_CHANGE_FAILED: string       = Commands.namespace + 'onCanvasIndexChangeFailed';
    static CANVAS_INDEX_CHANGED: string             = Commands.namespace + 'onCanvasIndexChanged';
    static CLICKTHROUGH: string                     = Commands.namespace + 'onClickthrough';
    static CLOSE_ACTIVE_DIALOGUE: string            = Commands.namespace + 'onCloseActiveDialogue';
    static CLOSE_LEFT_PANEL: string                 = Commands.namespace + 'onCloseLeftPanel';
    static CLOSE_RIGHT_PANEL: string                = Commands.namespace + 'onCloseRightPanel';
    static COPY_SOURCE_REFERENCE: string            = Commands.namespace + 'onCopySourceReference';
    static CREATED: string                          = Commands.namespace + 'onCreated';
    static DOWN_ARROW: string                       = Commands.namespace + 'onDownArrow';
    static DOWNLOAD: string                         = Commands.namespace + 'onDownload';
    static DROP: string                             = Commands.namespace + 'onDrop';
    static END: string                              = Commands.namespace + 'onEnd';
    static ESCAPE: string                           = Commands.namespace + 'onEscape';
    static EXTERNAL_LINK_CLICKED: string            = Commands.namespace + 'onExternalLinkClicked';
    static FEEDBACK: string                         = Commands.namespace + 'onFeedback';
    static FORBIDDEN: string                        = Commands.namespace + 'onForbidden';
    static HIDE_CLICKTHROUGH_DIALOGUE: string       = Commands.namespace + 'onHideClickthroughDialogue';
    static HIDE_DOWNLOAD_DIALOGUE: string           = Commands.namespace + 'onHideDownloadDialogue';
    static HIDE_EMBED_DIALOGUE: string              = Commands.namespace + 'onHideEmbedDialogue';
    static HIDE_EXTERNALCONTENT_DIALOGUE: string    = Commands.namespace + 'onHideExternalContentDialogue';
    static HIDE_GENERIC_DIALOGUE: string            = Commands.namespace + 'onHideGenericDialogue';
    static HIDE_HELP_DIALOGUE: string               = Commands.namespace + 'onHideHelpDialogue';
    static HIDE_INFORMATION: string                 = Commands.namespace + 'onHideInformation';
    static HIDE_LOGIN_DIALOGUE: string              = Commands.namespace + 'onHideLoginDialogue';
    static HIDE_OVERLAY: string                     = Commands.namespace + 'onHideOverlay';
    static HIDE_RESTRICTED_DIALOGUE: string         = Commands.namespace + 'onHideRestrictedDialogue';
    static HIDE_SETTINGS_DIALOGUE: string           = Commands.namespace + 'onHideSettingsDialogue';
    static HIDE_ADJUST_DIALOGUE: string             = Commands.namespace + 'onHideAdjustDialogue';
    static HIDE_SHARE_DIALOGUE: string              = Commands.namespace + 'onHideShareDialogue';
    static HOME: string                             = Commands.namespace + 'onHome';
    static LEFT_ARROW: string                       = Commands.namespace + 'onLeftArrow';
    static LEFTPANEL_COLLAPSE_FULL_FINISH: string   = Commands.namespace + 'onLeftPanelCollapseFullFinish';
    static LEFTPANEL_COLLAPSE_FULL_START: string    = Commands.namespace + 'onLeftPanelCollapseFullStart';
    static LEFTPANEL_EXPAND_FULL_FINISH: string     = Commands.namespace + 'onLeftPanelExpandFullFinish';
    static LEFTPANEL_EXPAND_FULL_START: string      = Commands.namespace + 'onLeftPanelExpandFullStart';
    static LOAD: string                             = Commands.namespace + 'onLoad';
    static LOAD_FAILED: string                      = Commands.namespace + 'onLoadFailed';
    static LOGIN: string                            = Commands.namespace + 'onLogin';
    static LOGIN_FAILED: string                     = Commands.namespace + 'onLoginFailed';
    static LOGOUT: string                           = Commands.namespace + 'onLogout';
    static MINUS: string                            = Commands.namespace + 'onMinus';
    static NOT_FOUND: string                        = Commands.namespace + 'onNotFound';
    static OPEN: string                             = Commands.namespace + 'onOpen';
    static OPEN_EXTERNAL_RESOURCE: string           = Commands.namespace + 'onOpenExternalResource';
    static OPEN_LEFT_PANEL: string                  = Commands.namespace + 'onOpenLeftPanel';
    static OPEN_RIGHT_PANEL: string                 = Commands.namespace + 'onOpenRightPanel';
    static PAGE_DOWN: string                        = Commands.namespace + 'onPageDown';
    static PAGE_UP: string                          = Commands.namespace + 'onPageUp';
    static PARENT_EXIT_FULLSCREEN: string           = Commands.namespace + 'onParentExitFullScreen';
    static PLUS: string                             = Commands.namespace + 'onPlus';
    static REDIRECT: string                         = Commands.namespace + 'onRedirect';
    static REFRESH: string                          = Commands.namespace + 'onRefresh';
    static RESIZE: string                           = Commands.namespace + 'onResize';
    static RESOURCE_DEGRADED: string                = Commands.namespace + 'onResourceDegraded';
    static RETRY: string                            = Commands.namespace + 'onRetry';
    static RETURN: string                           = Commands.namespace + 'onReturn';
    static RIGHT_ARROW: string                      = Commands.namespace + 'onRightArrow';
    static RIGHTPANEL_COLLAPSE_FULL_FINISH: string  = Commands.namespace + 'onRightPanelCollapseFullFinish';
    static RIGHTPANEL_COLLAPSE_FULL_START: string   = Commands.namespace + 'onRightPanelCollapseFullStart';
    static RIGHTPANEL_EXPAND_FULL_FINISH: string    = Commands.namespace + 'onRightPanelExpandFullFinish';
    static RIGHTPANEL_EXPAND_FULL_START: string     = Commands.namespace + 'onRightPanelExpandFullStart';
    static SEQUENCE_INDEX_CHANGED: string           = Commands.namespace + 'onSequenceIndexChanged';
    static SETTINGS_CHANGED: string                 = Commands.namespace + 'onSettingsChanged';
    static SHOW_CLICKTHROUGH_DIALOGUE: string       = Commands.namespace + 'onShowClickThroughDialogue';
    static SHOW_DOWNLOAD_DIALOGUE: string           = Commands.namespace + 'onShowDownloadDialogue';
    static SHOW_EMBED_DIALOGUE: string              = Commands.namespace + 'onShowEmbedDialogue';
    static SHOW_EXTERNALCONTENT_DIALOGUE: string    = Commands.namespace + 'onShowExternalContentDialogue';
    static SHOW_GENERIC_DIALOGUE: string            = Commands.namespace + 'onShowGenericDialogue';
    static SHOW_HELP_DIALOGUE: string               = Commands.namespace + 'onShowHelpDialogue';
    static SHOW_INFORMATION: string                 = Commands.namespace + 'onShowInformation';
    static SHOW_LOGIN_DIALOGUE: string              = Commands.namespace + 'onShowLoginDialogue';
    static SHOW_OVERLAY: string                     = Commands.namespace + 'onShowOverlay';
    static SHOW_RESTRICTED_DIALOGUE: string         = Commands.namespace + 'onShowRestrictedDialogue';
    static SHOW_SETTINGS_DIALOGUE: string           = Commands.namespace + 'onShowSettingsDialogue';
    static SHOW_ADJUST_DIALOGUE: string             = Commands.namespace + 'onShowAdjustDialogue';
    static SHOW_SHARE_DIALOGUE: string              = Commands.namespace + 'onShowShareDialogue';
    static THUMB_SELECTED: string                   = Commands.namespace + 'onThumbSelected';
    static TOGGLE_EXPAND_LEFT_PANEL: string         = Commands.namespace + 'onToggleExpandLeftPanel';
    static TOGGLE_EXPAND_RIGHT_PANEL: string        = Commands.namespace + 'onToggleExpandRightPanel';
    static TOGGLE_FULLSCREEN: string                = Commands.namespace + 'onToggleFullScreen';
    static UP_ARROW: string                         = Commands.namespace + 'onUpArrow';
    static UPDATE_SETTINGS: string                  = Commands.namespace + 'onUpdateSettings';
    static VIEW_FULL_TERMS: string                  = Commands.namespace + 'onViewFullTerms';
    static WINDOW_UNLOAD: string                    = Commands.namespace + 'onWindowUnload';
    static ADJUST_CONTRAST: string                  = Commands.namespace + 'onAdjustContrast';
    static ADJUST_BRIGHTNESS: string                = Commands.namespace + 'onAdjustBrightness';
    static ADJUST_FINALIZE: string                  = Commands.namespace + 'onAdjustFinalize';
}

export = Commands;