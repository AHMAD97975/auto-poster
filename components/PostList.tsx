import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { Button } from './Button';
import { generatePostImage } from '../services/geminiService';
import { shareContent } from '../services/socialService';

interface PostListProps {
  posts: Post[];
  referenceImage?: string;
  onUpdate?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

const SocialMediaPreview: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="border border-gray-200 rounded-xl bg-white max-w-sm mx-auto my-4 overflow-hidden shadow-sm font-sans" dir="rtl">
      {/* Header */}
      <div className="flex items-center p-3 gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">اسم المستخدم</p>
          <p className="text-xs text-gray-500">منذ ساعتين</p>
        </div>
        <div className="text-gray-400">•••</div>
      </div>

      {/* Content */}
      <div className="px-3 pb-2 text-sm text-gray-800 whitespace-pre-wrap leading-normal text-right">
        {post.content}
        <div className="mt-2 text-indigo-600">
            {post.hashtags?.map(tag => `${tag} `)}
        </div>
      </div>

      {/* Image */}
      <div className="w-full bg-gray-100">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center text-gray-400 text-xs border-y border-gray-100">
             [صورة المنشور]
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 flex justify-between items-center text-gray-500 border-t border-gray-100 mt-1">
         <div className="flex gap-4">
             <span>❤️</span>
             <span>💬</span>
             <span>✈️</span>
         </div>
         <span className="text-xs">حفظ</span>
      </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post; referenceImage?: string; onUpdate?: (p: Post) => void; onDelete?: (id: string) => void }> = ({ post: initialPost, referenceImage, onUpdate, onDelete }) => {
    const [post, setPost] = useState(initialPost);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const [promptText, setPromptText] = useState(post.imagePrompt || "");
    const [showPromptEdit, setShowPromptEdit] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    
    // Hashtags State
    const [newTag, setNewTag] = useState("");

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: post.title,
        content: post.content,
        scheduledTime: post.scheduledTime
    });

    useEffect(() => {
        setPost(initialPost);
    }, [initialPost]);

    // Propagate changes to parent
    const updatePostState = (updatedPost: Post) => {
        setPost(updatedPost);
        if (onUpdate) {
            onUpdate(updatedPost);
        }
    };

    const handleGenerateImage = async () => {
        if (!promptText) return;
        setIsGeneratingImg(true);
        try {
            const base64Image = await generatePostImage(promptText, referenceImage);
            if (base64Image) {
                const updated = { ...post, imageUrl: base64Image, imagePrompt: promptText };
                updatePostState(updated);
            } else {
                alert("لم يتم توليد صورة، حاول مرة أخرى.");
            }
        } catch (e) {
            alert("حدث خطأ أثناء توليد الصورة.");
        } finally {
            setIsGeneratingImg(false);
        }
    };

    const startEditing = () => {
        setEditData({
            title: post.title,
            content: post.content,
            scheduledTime: post.scheduledTime
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const saveEditing = () => {
        const updated = {
            ...post,
            title: editData.title,
            content: editData.content,
            scheduledTime: editData.scheduledTime
        };
        updatePostState(updated);
        setIsEditing(false);
    };
    
    const triggerShare = async (platform: string) => {
        setShowShareMenu(false);
        const success = await shareContent(platform, post);
        if (success) {
            updatePostState({ ...post, status: 'published' });
        }
    };

    const handleCopyText = () => {
        const tags = post.hashtags ? post.hashtags.join(' ') : '';
        const fullText = `${post.title}\n\n${post.content}\n\n${tags}`;
        navigator.clipboard.writeText(fullText).then(() => {
            alert("تم نسخ النص والوسوم إلى الحافظة!");
        });
    };

    const handleCopyHashtags = () => {
        const tags = post.hashtags ? post.hashtags.join(' ') : '';
        if (tags) {
            navigator.clipboard.writeText(tags).then(() => {
                alert("تم نسخ الوسوم فقط إلى الحافظة! 📋");
            });
        }
    };

    const handleDownloadImage = () => {
        if (!post.imageUrl) return;
        const link = document.createElement('a');
        link.href = post.imageUrl;
        link.download = `post-${post.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        const tag = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
        const currentTags = post.hashtags || [];
        if (!currentTags.includes(tag)) {
            const updated = { ...post, hashtags: [...currentTags, tag] };
            updatePostState(updated);
        }
        setNewTag("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = post.hashtags || [];
        const updated = { ...post, hashtags: currentTags.filter(t => t !== tagToRemove) };
        updatePostState(updated);
    };

    // Helper for datetime-local input to convert ISO to local YYYY-MM-DDTHH:mm
    const getLocalDateTime = (isoString?: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset() * 60000;
        return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            setEditData({...editData, scheduledTime: undefined});
            return;
        }
        const date = new Date(e.target.value);
        setEditData({...editData, scheduledTime: date.toISOString()});
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'published':
                return {
                    className: 'bg-green-100 text-green-800 ring-1 ring-green-600/20',
                    label: 'تم النشر',
                    icon: (
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'failed':
                return {
                    className: 'bg-red-100 text-red-800 ring-1 ring-red-600/20',
                    label: 'فشل النشر',
                    icon: (
                         <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'pending':
            default:
                return {
                    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
                    label: 'قيد الانتظار',
                    icon: (
                         <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const statusConfig = getStatusConfig(post.status);

    return (
        <div className={`bg-white shadow rounded-lg p-6 border-r-4 ${post.status === 'failed' ? 'border-red-500' : post.status === 'published' ? 'border-green-500' : 'border-indigo-500'}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 ml-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">اليوم {post.day}</span>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-lg font-semibold focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="عنوان المنشور"
                        />
                    ) : (
                        <h4 className="text-lg font-semibold text-gray-900 mt-1">{post.title}</h4>
                    )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusConfig.className}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                </span>
            </div>
          
            <div className="mt-3 relative group">
                {isEditing ? (
                    <textarea
                        value={editData.content}
                        onChange={(e) => setEditData({...editData, content: e.target.value})}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm leading-relaxed focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="محتوى المنشور..."
                    />
                ) : (
                    <div className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100 relative">
                        {post.content}
                        <button 
                            onClick={handleCopyText}
                            className="absolute top-2 left-2 p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="نسخ النص بالكامل"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Hashtags Section */}
            <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-500">الوسوم المقترحة (Trend Hashtags)</label>
                    {post.hashtags && post.hashtags.length > 0 && (
                        <button 
                            onClick={handleCopyHashtags}
                            className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded flex items-center gap-1 transition-colors border border-gray-200"
                            title="نسخ الوسوم فقط"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                            نسخ الوسوم
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {post.hashtags?.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 group">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="mr-1 text-indigo-400 hover:text-indigo-900 focus:outline-none">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </span>
                    ))}
                    <div className="flex items-center">
                        <input 
                            type="text" 
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="+ إضافة وسم"
                            className="w-24 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Preview Toggle */}
            <div className="mt-3 flex justify-end">
                <button 
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${showPreview ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {showPreview ? 'إخفاء المعاينة' : 'معاينة المنشور'}
                </button>
            </div>

            {showPreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
                    <p className="text-center text-xs text-gray-500 mb-2">معاينة افتراضية (Preview)</p>
                    <SocialMediaPreview post={isEditing ? { ...post, title: editData.title, content: editData.content } : post} />
                </div>
            )}

            {/* Image Section */}
            <div className="mt-4 border-t border-gray-100 pt-4">
                {post.imageUrl ? (
                    <div className="mb-4 relative group">
                        <img src={post.imageUrl} alt="Generated Content" className="w-full h-auto max-h-96 object-cover rounded-lg shadow-sm" />
                        <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={handleDownloadImage} className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white text-gray-700 hover:text-indigo-600" title="تحميل الصورة">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                             </button>
                        </div>
                        <div className="flex justify-end mt-2">
                             <button onClick={() => updatePostState({...post, imageUrl: undefined})} className="text-xs text-red-600 hover:text-red-800">إزالة الصورة</button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-gray-500 mb-2">لا توجد صورة لهذا المنشور</p>
                    </div>
                )}

                <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-gray-700">وصف الصورة (Prompt)</label>
                        <button 
                            onClick={() => setShowPromptEdit(!showPromptEdit)}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                            {showPromptEdit ? 'إخفاء الوصف' : 'تعديل الوصف'}
                        </button>
                    </div>
                    
                    {(showPromptEdit || !post.imageUrl) && (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                className="flex-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                                placeholder="وصف الصورة بالإنجليزية..."
                            />
                            <Button 
                                onClick={handleGenerateImage} 
                                isLoading={isGeneratingImg}
                                className="whitespace-nowrap"
                                disabled={!promptText}
                            >
                                {post.imageUrl ? 'تغيير الصورة' : 'توليد الصورة'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <span>مجدول:</span>
                    {isEditing ? (
                        <input 
                            type="datetime-local" 
                            value={getLocalDateTime(editData.scheduledTime)}
                            onChange={handleDateChange}
                            className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        <span className="font-medium text-gray-600">{post.scheduledTime ? new Date(post.scheduledTime).toLocaleString('ar-EG') : 'غير مجدول'}</span>
                    )}
                </div>
                
                <div className="flex gap-3 items-center">
                    {isEditing ? (
                        <>
                            <button onClick={saveEditing} className="text-green-600 hover:text-green-800 font-bold px-2 py-1 rounded hover:bg-green-50">حفظ</button>
                            <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">إلغاء</button>
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 border border-sky-100 bg-sky-50 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-colors"
                                    title="نشر الآن"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                    نشر
                                </button>
                                {showShareMenu && (
                                    <div className="absolute left-0 bottom-full mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 overflow-hidden">
                                        <button onClick={() => triggerShare('twitter')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-500">Twitter (X)</button>
                                        <button onClick={() => triggerShare('linkedin')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700">LinkedIn</button>
                                        <button onClick={() => triggerShare('facebook')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Facebook</button>
                                        <button onClick={() => triggerShare('instagram')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600">Instagram</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={startEditing} className="text-indigo-600 hover:text-indigo-800 font-medium">تعديل</button>
                            <button onClick={() => onDelete && onDelete(post.id)} className="text-red-600 hover:text-red-800 font-medium">حذف</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export const PostList: React.FC<PostListProps> = ({ posts, referenceImage, onUpdate, onDelete }) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} referenceImage={referenceImage} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
};