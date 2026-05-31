"use client";

import { useMemo, useState } from "react";
import type { Contact } from "@/lib/types";

const contactLabels: Record<string, string> = {
  wechat: "微信",
  whatsapp: "WhatsApp",
  telegram: "Telegram"
};

function CopyIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M8 8.5A2.5 2.5 0 0 1 10.5 6h6A2.5 2.5 0 0 1 19 8.5v6A2.5 2.5 0 0 1 16.5 17h-6A2.5 2.5 0 0 1 8 14.5v-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M6 13.5H5.5A2.5 2.5 0 0 1 3 11V5.5A2.5 2.5 0 0 1 5.5 3H11a2.5 2.5 0 0 1 2.5 2.5V6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function normalizeWhatsApp(value: string) {
  const digits = value.replace(/[^\d]/g, "");

  if (digits.length < 8) {
    return "";
  }

  return digits;
}

function copySuccessMessage(method: string) {
  if (method === "wechat") {
    return "已复制微信号";
  }

  if (method === "whatsapp") {
    return "已复制 WhatsApp";
  }

  return "已复制联系方式";
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

export function ContactSellerSheet({
  productTitle,
  contacts
}: {
  productTitle: string;
  contacts: Contact[];
}) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const safeContacts = useMemo(
    () => contacts.filter((contact) => contact?.method && contact?.value?.trim()),
    [contacts]
  );
  const inquiryText = `你好，我在 PandaMarket 看到你的商品「${productTitle}」，请问还在吗？`;

  async function handleCopy(text: string, successMessage: string) {
    try {
      await copyText(text);
      setToast(successMessage);
      window.setTimeout(() => setToast(""), 1800);
    } catch (error) {
      console.error("Failed to copy contact text", { text, error });
      setToast("复制失败，请手动复制");
      window.setTimeout(() => setToast(""), 2200);
    }
  }

  return (
    <>
      <button
        className="w-full rounded-full bg-panda-lime px-5 py-3.5 text-base font-semibold text-panda-ink shadow-sm transition hover:bg-[#DFAF3D] active:scale-[0.99]"
        type="button"
        onClick={() => setOpen(true)}
      >
        联系卖家
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-panda-ink/30 px-3 pb-3 backdrop-blur-sm sm:items-center sm:pb-0">
          <button
            aria-label="关闭联系卖家面板"
            className="absolute inset-0 cursor-default"
            type="button"
            onClick={() => setOpen(false)}
          />
          <section className="relative w-full max-w-lg rounded-t-[2rem] border border-panda-line bg-[#FFFDF7] p-5 shadow-2xl sm:rounded-[2rem]">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-panda-line sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-panda-leaf">Contact</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-panda-ink">联系卖家</h2>
                <p className="mt-2 line-clamp-2 text-sm text-panda-muted">{productTitle}</p>
              </div>
              <button
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-panda-line bg-white text-lg text-panda-ink"
                type="button"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {safeContacts.length > 0 ? (
                safeContacts.map((contact) => {
                  const label = contactLabels[contact.method] ?? contact.method;
                  const value = contact.value.trim();
                  const whatsAppNumber = contact.method === "whatsapp" ? normalizeWhatsApp(value) : "";

                  return (
                    <div key={`${contact.method}-${value}`} className="rounded-[1.35rem] border border-panda-line bg-white p-4">
                      <p className="text-xs font-medium text-panda-muted">{label}</p>
                      <div className="mt-2 flex items-center gap-2 rounded-[1rem] border border-panda-line bg-panda-paper px-3 py-2.5">
                        <p className="min-w-0 flex-1 break-all text-sm font-semibold text-panda-ink">{value}</p>
                        <button
                          aria-label={`复制${label}`}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-panda-ink shadow-sm transition hover:bg-[#FFF8E1]"
                          type="button"
                          onClick={() => handleCopy(value, copySuccessMessage(contact.method))}
                        >
                          <CopyIcon />
                        </button>
                      </div>

                      {contact.method === "whatsapp" && whatsAppNumber ? (
                        <a
                          className="mt-3 inline-flex rounded-full bg-panda-lime px-4 py-2 text-sm font-semibold text-panda-ink shadow-sm"
                          href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(inquiryText)}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          打开 WhatsApp
                        </a>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.3rem] border border-panda-line bg-white p-5 text-sm font-medium text-panda-muted">
                  卖家暂未填写联系方式
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-panda-line bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-panda-muted">默认咨询话术</p>
                  <p className="mt-2 rounded-[1rem] bg-panda-paper px-3 py-3 text-sm leading-6 text-panda-ink">
                    {inquiryText}
                  </p>
                </div>
                <button
                  aria-label="复制咨询话术"
                  className="mt-6 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-panda-lime text-panda-ink shadow-sm transition hover:bg-[#DFAF3D]"
                  type="button"
                  onClick={() => handleCopy(inquiryText, "已复制咨询话术")}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>

            <p className="mt-4 rounded-[1.2rem] bg-panda-paper px-4 py-3 text-xs leading-5 text-panda-muted">
              建议在 UM 校园或公共区域当面交易，请勿提前转账，注意核对商品状态。
            </p>

            {toast ? (
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-panda-ink px-4 py-2 text-sm font-semibold text-white shadow-lg">
                {toast}
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

